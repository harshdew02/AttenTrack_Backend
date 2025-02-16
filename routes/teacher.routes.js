const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendance.model.js');

const { TeacherRegistration, TeacherLogin, getReport, VerifyOTP } = require('../controllers/teacher.controller.js');
const { get } = require('mongoose');
const { AuthOTPVerify, TokentLoginTeacher } = require('../middleware/authverify.js');

router.get('/', (req, res) => {
    res.send('route frome teacher');
})

router.post('/register', TeacherRegistration);
router.post('/verify-otp', AuthOTPVerify, VerifyOTP) 
router.post('/login', TeacherLogin);
router.get('/token-login', TokentLoginTeacher, TeacherLogin)




router.post('/records', getReport)

// const classId = '67306adc9ad2c0c37c4428ba';
// const startDate = '2024-10-01';
// const endDate = '2024-10-10';

module.exports = router