const express = require('express');
const { StudentRegistration, StudentLogin , EnrolledClasses} = require('../controllers/student.controller.js');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('route frome student');
})

router.post('/register', StudentRegistration)

router.post('/login', StudentLogin)

router.post('/otp', (req, res) => {
    res.send('route frome student');
})


router.get('/class-info/:studentRollNumber', EnrolledClasses );

module.exports = router