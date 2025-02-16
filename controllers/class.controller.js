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

            let studentarray = [];

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
                        fullName: student.name,
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
                return res.status(201).json({ message: "Class created successfully" });
            } else {
                return res.status(400).json({ error: "Class not created" });
            }

        }else{
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
        const students = classData.students.map(student => ({
            rollNumber: student.rollNumber,
            name: student.name,
        }));

        const teacherdata = await Teacher.findById(classData.teacher, { fullName: 1 });

        res.json({ teacher: teacherdata.fullName, rec: students });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    CreateClass, GetList
}


