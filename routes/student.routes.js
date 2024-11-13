const express = require('express');
const { StudentRegistration, StudentLogin , EnrolledClasses, GetAttandaces} = require('../controllers/student.controller.js');
const router = express.Router();
const Attendance = require('../models/attendance.model.js');

router.get('/', (req, res) => {
    res.send('route frome student');
})

router.post('/register', StudentRegistration)

router.post('/login', StudentLogin)

router.post('/otp', (req, res) => {
    res.send('route frome student');
})

router.get('/class-info/:studentRollNumber', EnrolledClasses );

router.get('/attendance', GetAttandaces);

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

// 