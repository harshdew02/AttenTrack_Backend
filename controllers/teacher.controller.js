const Teacher = require("../models/teacher.model.js");

const  TeacherRegistration = async (req, res) => {
    // return res.send('teacher registration');
    try {
        const { email, fullName, department, password, classes } = req.body

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

        if(newTeacher){
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
        }else{
            res.status(400).json({ error: "Teacher not created" });
        }

    } catch (err) {
       console.log("Error in TeacherRegistration", err.message);
       console.log(err);
       res.status(500).send(error.message);
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

        res.status(200).json(
            {
                _id: teacher._id,
                email: teacher.email,
                fullName: teacher.fullName,
                department: teacher.department,
                password: teacher.password,
                classes: teacher.classes
            }
        );

    } catch (err) {
       console.log("Error in TeacherLogin", err.message);
       console.log(err);
       res.status(500).send(error.message);
    }
}


module.exports = {TeacherRegistration, TeacherLogin};