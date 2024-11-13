const Student = require("../models/student.model.js");
const Class = require('../models/class.model.js');
const Attendance = require('../models/attendance.model.js');
const Teacher = require('../models/teacher.model.js');

const StudentRegistration = async (req, res) => {
    // return res.send('Student registration');
    try {
        const { email, fullName, rollNumber, password } = req.body

        const student = await Student.findOne({ rollNumber })

        if (student) {
            return res.status(400).json({ error: "Student already exists" })
        }

        const newStudent = new Student({
            email,
            fullName,
            rollNumber,
            password,
        })

        if (newStudent) {
            await newStudent.save()

            res.status(201).json(
                {
                    _id: newStudent._id,
                    email: newStudent.email,
                    fullName: newStudent.fullName,
                    rollNumber: newStudent.rollNumber,
                    password: newStudent.password
                }
            );
        } else {
            res.status(400).json({ error: "Student not created" });
        }

    } catch (err) {
        console.log("Error in StudentRegistration", err.message);
        console.log(err);
        res.status(500).send(err.message);
    }
}


const StudentLogin = async (req, res) => {
    try {
        const { email, rollNumber, password } = req.body
        const student = await Student.findOne({ rollNumber })

        if (!student) {
            return res.status(400).json({ error: "Student not found" })
        }

        if (student.password !== password) {
            return res.status(400).json({ error: "Invalid password" })
        }

        res.status(200).json(
            {
                _id: student._id,
                email: student.email,
                fullName: student.fullName,
                rollNumber: student.rollNumber,
                password: student.password
            }
        );

    } catch (err) {
        console.log("Error in StudentLogin", err.message);
        console.log(err);
        res.status(500).send(err.message);
    }
}

const EnrolledClasses = async (req, res) => {
    const { studentRollNumber } = req.params;
    // return res.json({ studentRollNumber });
    try {
        const classes = await Class.find({
            'students.rollNumber': studentRollNumber
        }).select('classname batch semester department');

        if (!classes || classes.length === 0) {
            return res.status(404).json({ message: 'Student not found in any class' });
        }
        res.json(classes);
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

        if(!classData){
            return res.status(404).json({ message: 'Class not found' });
        }
        // const teacherdata = await Teacher.findById(teacher, { fullName: 1 });

        const teacherdata = await Teacher.findById(classData.teacher, { fullName: 1 });

        if(!teacherdata){
            return res.status(404).json({ message: 'Teacher not found' });
        }

        res.json({"teacher":teacherdata.fullName,res:result});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { StudentRegistration, StudentLogin, EnrolledClasses, GetAttandaces };

