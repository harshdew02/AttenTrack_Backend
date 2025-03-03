const jwt = require('jsonwebtoken');
// const Student = require('../models/student.model');
const Teacher = require('../models/teacher.model');


const AuthOTPVerify = async (req, res, next) => {    
    try {
        const token = req.headers.authorization?.split(" ")[1];
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded.otp);
        console.log(req.body.otp);

        if (decoded.otp === req.body.otp) {
            next();
        }else{
            return res.status(401).json({ error: 'Unauthorized access' });
        }
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

const TokentLogin = async (req, res, next) => {
    try {
        
        const Student = require('../models/student.model');

        const token = req.headers.authorization?.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("token login:",decoded);

        const student = await Student.findById(decoded.id);

        if(!student){
            return res.status(401).json({ error: 'Unauthorized access' });
        }

        return res.status(201).json(
            {
                id: student._id,
                email: student.email,
                fullName: student.fullName,
                rollNumber: student.rollNumber,
                password: student.password,
                batch: student.batch,
                coursesId: student.courses,
            }
        );

    } catch (error) {
        console.log(error.message);
        res.status(401).json({ error: error.message });
    }
}
const TokentLoginTeacher = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("token login",decoded);

        const teacher = await Teacher.findById(decoded.id);

        console.log(teacher);

        if(!teacher){
            return res.status(401).json({ error: 'Unauthorized access' });
        }

        return res.status(200).json(
            {
                id: teacher._id,
                email: teacher.email,
                fullName: teacher.fullName,
                password: teacher.password,
                department: teacher.department,
                coursesId: teacher.courses,
            }
        );
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}




module.exports = { AuthOTPVerify, TokentLogin, TokentLoginTeacher }; // Export AuthOTPVerify;