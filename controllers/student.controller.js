const Student = require("../models/student.model.js");
const Class = require('../models/class.model.js');
const Attendance = require('../models/attendance.model.js');
const Teacher = require('../models/teacher.model.js');
const { generateToken } = require("../services/token.service.js");

// const SendOTP = async (stud, email) => {
//     res.send('route frome student');
// }

const VerifyOTP = async (req, res) => {
    try {
        const { email, password, otp } = req.body

        const student = await Student.findOne({ email })

        if (student) {
            student.password = password;

            await student.save();

            let token = generateToken({ id: student._id });

            return res.status(201).json(
                {
                    id: student._id,
                    email: student.email,
                    fullName: student.fullName,
                    rollNumber: student.rollNumber,
                    password: student.password,
                    batch: student.batch,
                    coursesId: student.courses,
                    token: token
                }
            );
        } else {
            return res.status(404).json({ error: "Not found please tell your teacher to add in sheet" })
        }

    } catch (err) {
        console.log("Error in StudentRegistration", err.message);
        console.log(err);
        res.status(500).send(err.message);
    }
}

const StudentRegistration = async (req, res) => {
    try {
        const { email } = req.body

        const student = await Student.findOne({ email })

        if (student) {
            if (student.password === "any") {

                const otp = Math.floor(100000 + Math.random() * 900000);

                // SendOTP(student, email, otp);

                return res.status(200).json(
                    {
                        otpToken: generateToken({ otp: otp }),
                        tempOtp: otp
                    }
                );
            } else {
                return res.status(403).json({ error: "Student already registered please login or do forget password" })
            }
        } else {
            return res.status(404).json({ error: "Not found please tell your teacher to add in Class sheet" })
        }

    } catch (err) {
        console.log("Error in StudentRegistration", err.message);
        console.log(err);
        res.status(500).send(err.message);
    }
}


const StudentLogin = async (req, res) => {
    try {
        const { rollNumber, password } = req.body
        const student = await Student.findOne({ rollNumber })

        if (!student) {
            return res.status(400).json({ error: "Student not found" })
        }

        if (student.password === "any") {
            return res.status(400).json({ error: "Student not registered please tell your teacher to add in sheet" })
        }

        if (student.password !== password) {
            return res.status(400).json({ error: "Invalid password" })
        }

        let token = generateToken({ id: student._id });

        return res.status(201).json(
            {
                id: student._id,
                email: student.email,
                fullName: student.fullName,
                rollNumber: student.rollNumber,
                password: student.password,
                batch: student.batch,
                coursesId: student.courses,
                token: token
            }
        );

    } catch (err) {
        console.log("Error in StudentLogin", err.message);
        console.log(err);
        res.status(500).send(err.message);
    }
}

const EnrolledClasses = async (req, res) => {

    try {
        const studentdata = await Student.findById(req.params.student_id);

        if (!studentdata) {
            return res.status(404).json({ message: 'Student not found' });
        }

        let classes = [];

        for (const classId of studentdata.courses) {
            const classData = await Class.findById(classId);
            if (classData) {
                let classInfo = {
                    class_id: classData._id,
                    classname: classData.classname,
                    batch: classData.batch,
                    semester: classData.semester,
                    department: classData.department,
                    student_count: classData.studentsId.length
                }
                classes.push(classInfo);
            }
        }

        let body = {
            student_id: studentdata._id,
            fullName: studentdata.fullName,
            rollNumber: studentdata.rollNumber,
            email: studentdata.email,
            classes: classes,
        }

        res.json(body);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

const GetAttandaces = async (req, res) => {
    const { class_id, rollNumber } = req.query;
    try {
        // Query attendance by class_id and rollNumber
        const attendanceRecords = await Attendance.find({
            class_id,
            'records.rollNumber': rollNumber
        }).select('date records.$'); // Only select dates and matching record

        // Transform the result to only include date and is_present
        const result = attendanceRecords.map(record => {
            return {
                date: record.date,
                is_present: record.records[0].is_present
            };
        });

        const classData = await Class.findById(class_id);
        // console.log(classData);

        if (!classData) {
            return res.status(404).json({ message: 'Class not found' });
        }
        // const teacherdata = await Teacher.findById(teacher, { fullName: 1 });

        const teacherdata = await Teacher.findById(classData.teacher, { fullName: 1 });

        if (!teacherdata) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        res.json({ "teacher": teacherdata.fullName, res: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { StudentRegistration, StudentLogin, EnrolledClasses, GetAttandaces, VerifyOTP };

