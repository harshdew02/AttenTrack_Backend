const Teacher = require("../models/teacher.model.js");
const Class = require('../models/class.model.js');
const Attendance = require('../models/attendance.model.js');

const TeacherRegistration = async (req, res) => {
    // return res.send('teacher registration');
    try {
        const { email, fullName, department, password } = req.body

        const teacher = await Teacher.findOne({ email })

        if (teacher) {
            return res.status(400).json({ error: "Teacher already exists" })
        }

        const newTeacher = new Teacher({
            email,
            fullName,
            department,
            password,
            classes: []
        })

        if (newTeacher) {
            await newTeacher.save()

            res.status(201).json(
                {
                    _id: newTeacher._id,
                    email: newTeacher.email,
                    fullName: newTeacher.fullName,
                    department: newTeacher.department,
                    password: newTeacher.password,
                    classes: newTeacher.classes
                }
            );
        } else {
            res.status(400).json({ error: "Teacher not created" });
        }

    } catch (err) {
        console.log("Error in TeacherRegistration", err.message);
        console.log(err);
        res.status(500).send(err.message);
    }
}

const TeacherLogin = async (req, res) => {
    try {
        const { email, department, password } = req.body
        const teacher = await Teacher.findOne({ email })

        if (!teacher) {
            return res.status(400).json({ error: "Teacher not found" })
        }

        if (teacher.password !== password) {
            return res.status(400).json({ error: "Invalid password" })
        }

        const cls = await Class.find({ _id: { $in: teacher.classes } });

        res.status(200).json(
            {
                _id: teacher._id,
                email: teacher.email,
                fullName: teacher.fullName,
                department: teacher.department,
                password: teacher.password,
                classes: cls
            }
        );

    } catch (err) {
        console.log("Error in TeacherLogin", err.message);
        console.log(err);
        res.status(500).send(err.message);
    }
}

const getReport = async (req, res) => {
    try {

        // const { class_id, startDate, endDate } = req.body;
        const { classId, startDate, endDate } = req.body;

        // const matchStage = {
        //     $and: [
        //         class_id ? { class_id: "class_id" } : {},
        //         {
        //             date: {
        //                 $gte: new Date(startDate),
        //                 $lte: new Date(endDate)
        //             }
        //         }
        //     ]
        // };

        // const attendanceData = await Attendance.aggregate([
        //     {
        //         $match: matchStage
        //     },
        //     { $unwind: "$records" },
        //     {
        //         $group: {
        //             _id: "$date",
        //             presentCount: {
        //                 $sum: { $cond: [{ $eq: ["$records.is_present", true] }, 1, 0] }
        //             },
        //             absentCount: {
        //                 $sum: { $cond: [{ $eq: ["$records.is_present", false] }, 1, 0] }
        //             }
        //         }
        //     },
        //     {
        //         $project: {
        //             _id: 0,
        //             date: '$_id',
        //             presentCount: '$presentCount',
        //             absentCount: '$absentCount'
        //         }
        //     },
        //     { $sort: { date: 1 } }
        // ]);

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
        const classData = await Class.findById(classId);
        if (!classData) {
            return res.status(404).json({ error: 'Class not found' });
        }

        // Calculate attendance and format response
        getAttendanceCount(classId, startDate, endDate)
            .then(({ tot, attendanceCount }) => {
                const rec = classData.students.map(student => ({
                    name: student.name,
                    rollNumber: student.rollNumber,
                    noDaysP: attendanceCount[student.rollNumber] || 0
                }));

                res.status(200).json({ tot, rec });
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


module.exports = { TeacherRegistration, TeacherLogin, getReport };
