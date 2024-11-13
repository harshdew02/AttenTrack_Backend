const Class = require('../models/class.model.js');
const Teacher = require('../models/teacher.model.js');
const Sheet = require('../models/sheet.model.js');

const CreateClass = async (req, res) => {
    try {
        
        const { classname, batch, semester, department, teacherid, students } = req.body;

        const cls = await Class.findOne({ classname });

        if (cls) {
            return res.status(400).json({ error: "Class already exists" });
        }

        // const newSheet = new Sheet({
        //     students: [...students ]
        // });
        // await newSheet.save();

        const newClass = new Class({
            classname,
            batch,
            semester,
            department,
            // sheet: newSheet._id,
            students,
            teacher: teacherid
        });

        if (newClass) {
            await newClass.save();
            const teacher = await Teacher.findById(teacherid);
            teacher.classes.push(newClass._id);
            await teacher.save();

            res.status(201).json({
                _id: newClass._id,
                classname: newClass.classname,
                batch: newClass.batch,
                semester: newClass.semester,
                department: newClass.department,
                // sheet: newClass.sheet,
                teacher: newClass.teacher,
                students: students
            });
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
        const classData = await Class.findById(req.params.class_id, 'students');
        if (!classData) {
            return res.status(404).json({ message: 'Class not found' });
        }
        const students = classData.students.map(student => ({
            rollNumber: student.rollNumber,
            name: student.name,
        }));
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    CreateClass,GetList
}


