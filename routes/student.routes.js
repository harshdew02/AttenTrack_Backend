const express = require('express');
const { StudentRegistration, StudentLogin, EnrolledClasses, GetAttandaces, VerifyOTP, GetAllAttendance, ForgotPassword, ChangePassword } = require('../controllers/student.controller.js');
const router = express.Router();
const { AuthOTPVerify, TokentLogin } = require('../middleware/authverify.js');

// done start
router.post('/register', StudentRegistration)
router.post('/verify-otp', AuthOTPVerify, VerifyOTP)
router.post('/login', StudentLogin)
router.get('/token-login', TokentLogin, StudentLogin)
router.get('/classes-info/:student_id', EnrolledClasses);
router.post('/attendance', GetAttandaces);
router.get('/attendance/:rollNumber', GetAllAttendance);
router.post('/forgot', ForgotPassword);
router.post('/change', ChangePassword)

// done end
module.exports = router