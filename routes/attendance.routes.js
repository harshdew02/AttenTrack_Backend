const express = require('express');
const router = express.Router();
const { CreateAttendance, DeleteAttendance, GetAttendance, ModifyAttendance } = require('../controllers/attendance.controller.js');

router.get('/', (req, res) => {    
    res.send('route frome attendance');
})

router.post('/createAttendance', CreateAttendance );
router.get('/specific-record', GetAttendance)
router.patch('/change-specific-record', ModifyAttendance)
router.delete('/delete-record', DeleteAttendance)

module.exports = router
