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
        const { classId, endDate } = req.body; // No need to get startDate from the body now

        // Step 1: Get the earliest date from the first attendance record for the class
        const firstAttendanceRecord = await Attendance.findOne({ class_id: classId }).sort({ date: 1 });

        if (!firstAttendanceRecord) {
            return res.status(404).json({ error: 'No attendance records found for this class' });
        }

        const startDate = firstAttendanceRecord.date; // The earliest date from the first attendance record
        const currentEndDate = endDate || new Date(); // Default endDate to the current date if not provided

        const getAttendanceCount = async (classId, startDate, endDate) => {
            try {
                const attendances = await Attendance.find({
                    class_id: classId,
                    date: { $gte: startDate, $lte: endDate } // Use the dynamic startDate and endDate
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

        // Step 2: Call the function using the first date and current date
        getAttendanceCount(classId, startDate, currentEndDate)
            .then(attendanceCount => {
                res.status(200).json(attendanceCount);
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


module.exports = { TeacherRegistration, TeacherLogin, getReport };
