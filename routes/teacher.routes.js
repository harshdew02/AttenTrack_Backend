const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('route frome teacher');
})

router.post('/register', (req, res) => {    
    res.send('route frome teacher');
})

router.post('/login', (req, res) => {
    res.send('route frome teacher');
})

router.post('/otp', (req, res) => {
    res.send('route frome teacher');
})


module.exports = router