const Class = require('../models/class.model.js');
const Teacher = require('../models/teacher.model.js');
const Sheet = require('../models/sheet.model.js');
const Student = require('../models/student.model.js');
const mongoose = require('mongoose');

const CreateClass = async (req, res) => {
    try {

        const { classname, batch, semester, department, teacherid, students } = req.body;

        const cls = await Class.findOne({ classname });

        if (cls) {
            return res.status(400).json({ error: "Class already exists" });
        }

        const newClass = new Class({
            classname,
            batch,
            semester,
            department,
            teacher: teacherid,
            students: []
        });

        if (newClass) {

            await newClass.save();

            const teacher = await Teacher.findById(teacherid);

            if (teacher) {
                teacher.courses.push(newClass._id);
                await teacher.save();
            }

            const courseId = newClass._id;

            for (const student of students) {
                const existingStudent = await Student.findOne({ email: student.email });
                if (existingStudent) {
                    if (!existingStudent.courses.includes(courseId)) {
                        existingStudent.courses.push(courseId);
                        newClass.studentsId.push(existingStudent._id);
                        await existingStudent.save();
                    }
                } else {
                    const newStudent = new Student({
                        email: student.email,
                        fullName: student.fullName,
                        rollNumber: student.rollNumber,
                        password: "any",
                        batch: batch.toString(),
                        courses: [courseId] // Add course ID to new student
                    });
                    if (newStudent) {
                        await newStudent.save();
                        newClass.studentsId.push(newStudent._id);
                    } else {
                        return res.status(400).json({ error: "Student not created" });
                    }
                }
            }

            const clss = await newClass.save();

            if (clss) {
                let body = {
                    class_id: clss._id,
                    classname: clss.classname,
                    batch: clss.batch,
                    semester: clss.semester,
                    department: clss.department,
                    teacherid: clss.teacher
                }
                return res.status(201).json( body );
            } else {
                return res.status(400).json({ error: "Class not created" });
            }

        } else {
            return res.status(400).json({ error: "Class not created" });
        }

    } catch (err) {
        console.log(err, "hi");
        res.status(500).send(err.message);
    }
}

const GetList = async (req, res) => {
    try {
        const classData = await Class.findById(req.params.class_id);
        if (!classData) {
            return res.status(404).json({ message: 'Class not found' });
        }

        let students = [];

        for (const studentId of classData.studentsId) {
            const student = await Student.findById(studentId);
            if (student) {
                let studentData = {
                    name: student.fullName,
                    rollNumber: student.rollNumber,
                    email: student.email
                }
                students.push(studentData);
            }
        }

        const body = {
            class_id: classData._id,
            classname: classData.classname,
            batch: classData.batch,
            semester: classData.semester,
            department: classData.department,
            students: students
        }

        res.status(200).json(body);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    CreateClass, GetList
}


