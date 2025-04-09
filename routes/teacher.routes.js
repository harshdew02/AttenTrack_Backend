const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendance.model.js');

const { TeacherRegistration, UpdateTeacher, TeacherLogin, getReport, VerifyOTP, GetClasses, ForgotPassword, ChangePassword, generateOTP, OverallRecords } = require('../controllers/teacher.controller.js');
const { get } = require('mongoose');
const { AuthOTPVerify, TokentLoginTeacher } = require('../middleware/authverify.js');

router.get('/', (req, res) => {
    res.send('route frome teacher');
})

// done start
router.post('/register', TeacherRegistration);
router.post('/verify-otp', AuthOTPVerify, VerifyOTP) 
router.post('/otp-generate', generateOTP)
router.post('/login', TeacherLogin);
router.get('/token-login', TokentLoginTeacher, TeacherLogin)
router.get('/classes-info/:teacher_id', GetClasses);
router.post('/records', getReport)
router.post('/forgot',AuthOTPVerify, ForgotPassword)
router.post('/change', ChangePassword)
router.put('/update', UpdateTeacher)
router.post('/overall-records', OverallRecords)
module.exports = router