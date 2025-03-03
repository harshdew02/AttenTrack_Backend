const Teacher = require("../models/teacher.model.js");
const Class = require('../models/class.model.js');
const Attendance = require('../models/attendance.model.js');
const { generateToken } = require("../services/token.service.js");
const bcrypt = require("bcryptjs");
const { SendOTP } = require("../services/mail.service.js");


const VerifyOTP = async (req, res) => {
    try {
        const { email, password, otp } = req.body

        const teacher = await Teacher.findOne({ email })

        console.log(teacher);

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
            if (await bcrypt.compare("any", teacher.password)) {

                const otp = Math.floor(100000 + Math.random() * 900000);

                const send = {
                    name: teacher.fullName,
                    email: teacher.email,
                }

                await SendOTP(email, otp, send);

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
        const teacher = await Teacher.findOne({ email })

        if (!teacher) {
            return res.status(400).json({ error: "teacher not found" })
        }

        if (await bcrypt.compare("any", teacher.password)) {
            return res.status(400).json({ error: "teacher not registered please tell your teacher to add in sheet" })
        }

         const isMatch = await bcrypt.compare(password, teacher.password);

        if (!isMatch) {
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

const GetClasses = async (req, res) => {
    try {
        const teacherdata = await Teacher.findById(req.params.teacher_id);

        if (!teacherdata) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        let classes = [];

        for (const classId of teacherdata.courses) {
            const classData = await Class.findById(classId);
            if (classData) {
                let classInfo = {
                    classname: classData.classname,
                    batch: classData.batch,
                    semester: classData.semester,
                    department: classData.department,
                    class_id: classData._id,
                    student_count: classData.studentsId.length
                }
                classes.push(classInfo);
            }
        }

        let body = {
            teacher_id: teacherdata._id,
            teacher_email: teacherdata.email,
            teacher_name: teacherdata.fullName,
            department: teacherdata.department,
            classes: classes,
        }

        res.json(body);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

const getReport = async (req, res) => {
    try {
        const { class_id, startDate, endDate, rollNumber } = req.body;

        if (!class_id || !startDate || !endDate) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const attendanceRecords = await Attendance.find({
            class_id,
            date: { $gte: start, $lte: end }
        });

        let report = {};
        let totalDays = attendanceRecords.length;

        attendanceRecords.forEach(record => {
            record.records.forEach((present, rollNumber) => {
              if (!report[rollNumber]) {
                report[rollNumber] = { totalDays, presentCount: 0 };
              }
              if (present) {
                report[rollNumber].presentCount++;
              }
            });
          });
      
          res.json({ class_id, totalDays, report });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
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


module.exports = { TeacherRegistration, TeacherLogin, getReport, VerifyOTP, GetClasses };
