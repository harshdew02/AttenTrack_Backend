const express = require('express');
const { StudentRegistration, StudentLogin } = require('../controllers/student.controller');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('route frome student');
})

router.post('/register', StudentRegistration)

router.post('/login', StudentLogin )

router.post('/otp', (req, res) => {
    res.send('route frome student');
})


module.exports = router