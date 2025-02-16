const Teacher = require("../models/teacher.model.js");
const Class = require('../models/class.model.js');
const Attendance = require('../models/attendance.model.js');
const { generateToken } = require("../services/token.service.js");


const VerifyOTP = async (req, res) => {
    try {
        const { email, password, otp } = req.body

        const teacher = await Teacher.findOne({ email })

        if (teacher) {
            teacher.password = password;

            await teacher.save();

            let token = generateToken({ id: teacher._id });

            return res.status(200).json(
                {
                    id: teacher._id,
                    email: teacher.email,
                    fullName: teacher.fullName,
                    password: teacher.password,
                    department: teacher.department,
                    coursesId: teacher.courses,
                    token: token
                }
            );
        } else {
            return res.status(404).json({ error: "Not found please tell your teacher to add in sheet" })
        }
    } catch (err) {
        console.log("Error in teacherRegistration", err.message);
        console.log(err);
        res.status(500).send(err.message);
    }
}

const TeacherRegistration = async (req, res) => {
    // return res.send('teacher registration');
    try {
        const { email } = req.body

        const teacher = await Teacher.findOne({ email })

        if (teacher) {
            if (teacher.password === "any") {

                const otp = Math.floor(100000 + Math.random() * 900000);

                // SendOTP(student, email, otp);

                return res.status(200).json(
                    {
                        otpToken: generateToken({ otp: otp }),
                        tempOtp: otp
                    }
                );
            } else {
                return res.status(403).json({ error: "Teacher already registered please login or do forget password" })
            }
        } else {
            return res.status(404).json({ error: "Not found please tell the super admin to add in Teacher sheet" })
        }
    } catch (err) {
        console.log("Error in TeacherRegistration", err.message);
        console.log(err);
        res.status(500).send(err.message);
    }
}

const TeacherLogin = async (req, res) => {
    try {

        const { email, password } = req.body
        const teacher = await Teacher.findOne({email })

        if (!teacher) {
            return res.status(400).json({ error: "teacher not found" })
        }

        if (teacher.password === "any") {
            return res.status(400).json({ error: "teacher not registered please tell your teacher to add in sheet" })
        }

        if (teacher.password !== password) {
            return res.status(400).json({ error: "Invalid password" })
        }

        let token = generateToken({ id: teacher._id });

        return res.status(200).json(
            {
                id: teacher._id,
                email: teacher.email,
                fullName: teacher.fullName,
                password: teacher.password,
                department: teacher.department,
                coursesId: teacher.courses,
                token: token
            }
        );
    } catch (err) {
        console.log("Error in Teacher Login", err.message);
        console.log(err);
        res.status(500).send(err.message);
    }
}

const getReport = async (req, res) => {
    try {

        const { class_id, startDate, endDate } = req.body;
        // const { classId, startDate, endDate } = req.body;

        // let class_id = classId;

        // const matchStage = class_id ? { class_id: "class_id" } : {};

        const matchStage = {
            $and: [
                // class_id ? { class_id: "class_id" } : {},
                {
                    date: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            ]
        };

        const attendanceData = await Attendance.aggregate([
            {
                $match: matchStage
            },
            { $unwind: "$records" },
            {
                $group: {
                    _id: "$date",
                    presentCount: {
                        $sum: { $cond: [{ $eq: ["$records.is_present", true] }, 1, 0] }
                    },
                    absentCount: {
                        $sum: { $cond: [{ $eq: ["$records.is_present", false] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    presentCount: '$presentCount',
                    absentCount: '$absentCount'
                }
            },
            { $sort: { date: 1 } }
        ]);

        // res.json({ attenInfo: attendanceData });
        //   res.json({ "hi": "hello" });
        // return;

        // const classId = class_id;

        // Get attendance count function
        const getAttendanceCount = async (classId, startDate, endDate) => {
            try {
                const attendances = await Attendance.find({
                    class_id: classId,
                    date: { $gte: new Date(startDate), $lte: new Date(endDate) }
                });

                const attendanceCount = {};
                let tot = 0;

                attendances.forEach(attendance => {
                    attendance.records.forEach(record => {
                        const { rollNumber, is_present } = record;
                        if (!attendanceCount[rollNumber]) {
                            attendanceCount[rollNumber] = 0;
                        }
                        if (is_present) {
                            attendanceCount[rollNumber] += 1;
                        }
                    });
                    tot += 1;
                });

                return { tot, attendanceCount };

            } catch (error) {
                console.error(error);
                throw new Error('Error calculating attendance count');
            }
        };

        // Get class data to include student names
        const classData = await Class.findById(class_id);
        if (!classData) {
            return res.status(404).json({ error: 'Class not found', classData, "class_id": class_id });
        }


        // Calculate attendance and format response
        getAttendanceCount(class_id, startDate, endDate)
            .then(({ tot, attendanceCount }) => {
                const rec = classData.students.map(student => ({
                    name: student.name,
                    rollNumber: student.rollNumber,
                    noDaysP: attendanceCount[student.rollNumber] || 0
                }));

                res.status(200).json({ tot, rec, attendanceData });
                // res.status(200).json({ tot, rec });
            })
            .catch(error => {
                console.error(error);
                res.status(500).json({ error: 'Error calculating attendance report' });
            });

    } catch (err) {
        console.log("Error in getReport", err.message);
        res.status(500).send(err.message);
    }
};


// const getReport = async (req, res) => {
//     try {
//         const { classId, startDate, endDate } = req.body; // No need to get startDate from the body now

//         const getAttendanceCount = async (classId, startDate, endDate) => {
//             try {
//                 const attendances = await Attendance.find({
//                     class_id: classId,
//                     date: { $gte: new Date(startDate), $lte: new Date(endDate) } // Use the dynamic startDate and endDate
//                 });

//                 const attendanceCount = {};
//                 let tot = 0;

//                 attendances.forEach(attendance => {
//                     attendance.records.forEach(record => {
//                         const { rollNumber, is_present } = record;
//                         if (!attendanceCount[rollNumber]) {
//                             attendanceCount[rollNumber] = 0;
//                         }
//                         if (is_present) {
//                             attendanceCount[rollNumber] += 1;
//                         }
//                     });
//                     tot += 1;
//                 });

//                 return { tot, attendanceCount };

//             } catch (error) {
//                 console.error(error);
//                 throw new Error('Error calculating attendance count');
//             }
//         };

//         // Step 2: Call the function using the first date and current date
//         getAttendanceCount(classId, startDate, endDate)
//             .then(attendanceCount => {
//                 res.status(200).json(attendanceCount);
//             })
//             .catch(error => {
//                 console.error(error);
//                 res.status(500).json({ error: 'Error calculating attendance report' });
//             });

//     } catch (err) {
//         console.log("Error in getReport", err.message);
//         res.status(500).send(err.message);
//     }
// };


module.exports = { TeacherRegistration, TeacherLogin, getReport, VerifyOTP };
