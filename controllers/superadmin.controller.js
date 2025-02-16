const Teacher = require('../models/teacher.model');


const AddTeacher = async (req, res) => {
    try {
        const { email, fullName, department } = req.body;

        const teacher = await Teacher.findOne({ email })

        if (teacher) {
            return res.status(400).json({ error: "Teacher already exists" })
        }

        const newTeacher = new Teacher({
            email,
            fullName,
            password: "any",
            department,
            courses: [],
        });

        if (newTeacher) {
            await newTeacher.save();
            return res.status(201).json({ message: "Teacher added successfully" })
        } else {
            return res.status(400).json({ error: "Teacher not added" })
        }
    } catch (err) {
        console.log("Error in AddTeacher", err.message);
        console.log(err);
        res.status(500).send(err.message);
    }
}

const AddTeacheronBulk = async (req, res) => {
    try {
        const { teachers } = req.body;

        for (const teacher of teachers) {

            const teacherExists = await Teacher.findOne({ email: teacher.email });

            if (!teacherExists) {
                const newTeacher = new Teacher({
                    email: teacher.email,
                    fullName: teacher.fullName,
                    password: "any",
                    department: teacher.department,
                    courses: [],
                });
                await newTeacher.save();
            }
        }
        return res.status(201).json({ message: "Teachers added successfully" })
    } catch (err) {
        console.log("Error in AddTeacher", err.message);
        console.log(err);
        res.status(500).send(err.message);
    }
}

module.exports = { AddTeacher, AddTeacheronBulk };