const express = require('express');
const { StudentRegistration, StudentLogin, EnrolledClasses, GetAttandaces, VerifyOTP, GetAllAttendance, ForgotPassword } = require('../controllers/student.controller.js');
const router = express.Router();
const Attendance = require('../models/attendance.model.js');
const Class = require('../models/class.model.js');
const { AuthOTPVerify, TokentLogin } = require('../middleware/authverify.js');

// router.get('/', (req, res) => {
//     res.send('route frome student');
// })

// done start
router.post('/register', StudentRegistration)
router.post('/verify-otp', AuthOTPVerify, VerifyOTP)
router.post('/login', StudentLogin)
router.get('/token-login', TokentLogin, StudentLogin)
router.get('/classes-info/:student_id', EnrolledClasses);
router.post('/attendance', GetAttandaces);
router.get('/attendance/:rollNumber', GetAllAttendance);
router.post('/forgot', ForgotPassword);
// done end




module.exports = router

// roll number, class id -> array obj araray 1, date , pre or absent

// date

// arry obj [
// {
//     Date
//     present_coutn
//     abs_count
// },
// ....
// ]


// teacher name include,  get student attendace vale me , class name include

//  rollno -> array obj
// {
//     class_name,
//     dates_present
//     dates_absent
// }



