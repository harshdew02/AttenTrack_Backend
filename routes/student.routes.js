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
      const { rollNumber } = req.params;
  
      // Fetch all classes where the student is enrolled
      const classes = await Class.find({ 'students.rollNumber': rollNumber });

      console.log(classes);
  
      if (!classes) {
        return res.status(404).json({ message: 'Student not found in any class.' });
      }
  
      const attendanceData = await Promise.all(classes.map(async (classData) => {
        const attendanceRecords = await Attendance.find({ class_id: classData._id });
  
        let numberOfDatesP = 0;
        let numberOfDatesA = 0;
  
        // Loop through each attendance record for the class and count presence/absence
        attendanceRecords.forEach(record => {
          const studentRecord = record.records.find(r => r.rollNumber === rollNumber);
          if (studentRecord) {
            if (studentRecord.is_present) {
              numberOfDatesP++;
            } else {
              numberOfDatesA++;
            }
          }
        });
  
        return {
          class_name: classData.classname,
          numberOfDatesP,
          numberOfDatesA
        };
      }));
  
      res.json(attendanceData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
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



