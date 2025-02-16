const jwt = require('jsonwebtoken');
const Student = require('../models/student.model');
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
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("token login",decoded);

        const stud = await Student.findById(decoded.id);

        console.log(stud);

        req.body.rollNumber = stud.rollNumber;
        req.body.password = stud.password;

        console.log(req);

        next();
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}
const TokentLoginTeacher = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("token login",decoded);

        const teach = await Teacher.findById(decoded.id);

        console.log(teach);

        req.body.email = teach.email;
        req.body.password = teach.password;

        console.log(req);

        next();
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}




module.exports = { AuthOTPVerify, TokentLogin, TokentLoginTeacher }; // Export AuthOTPVerify;