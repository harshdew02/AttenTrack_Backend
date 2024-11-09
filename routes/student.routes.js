const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('route frome student');
})

router.post('/register', (req, res) => {    
    res.send('route frome student');
})

router.post('/login', (req, res) => {
    res.send('route frome student');
})

router.post('/otp', (req, res) => {
    res.send('route frome student');
})


module.exports = router