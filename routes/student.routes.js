const express = require('express');
const { StudentRegistration, StudentLogin , EnrolledClasses, GetAttandaces} = require('../controllers/student.controller.js');
const router = express.Router();
const Attendance = require('../models/attendance.model.js');
const Class = require('../models/class.model.js');

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


router.get('/attendance/:rollNumber', async (req, res) => {
    try {
      const rollNumber = req.params.rollNumber;
  
      // Find attendance records for the given roll number
      const attendanceRecords = await Attendance.find({
        "records.rollNumber": rollNumber
      }).populate('class_id');
  
      // Process the attendance data
      const attendanceSummary = attendanceRecords.map(record => {
        const className = record.class_id.classname;
        const numberOfDatesP = record.records.filter(r => r.rollNumber === rollNumber && r.is_present).length;
        const numberOfDatesA = record.records.filter(r => r.rollNumber === rollNumber && !r.is_present).length;
  
        return {
          class_name: className,
          numberOfDatesP,
          numberOfDatesA
        };
      });
  
      res.json(attendanceSummary);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });

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

//  rollno -> array obj
// {
//     class_name,
//     dates_present
//     dates_absent
// }



