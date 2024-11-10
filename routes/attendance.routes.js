const express = require('express');
const router = express.Router();
const { CreateAttendance } = require('../controllers/attendance.controller.js');

router.get('/', (req, res) => {    
    res.send('route frome attendance');
})

router.post('/createAttendance', CreateAttendance );


module.exports = router
