const express = require('express');
const router = express.Router();

const { TeacherRegistration, TeacherLogin } = require('../controllers/teacher.controller.js');

router.get('/', (req, res) => {
    res.send('route frome teacher');
})

router.post('/register', TeacherRegistration);

router.post('/login', TeacherLogin);

router.post('/otp', (req, res) => {
    res.send('route frome teacher');
})


module.exports = router