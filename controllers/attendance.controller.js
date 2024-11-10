const Attendance = require('../models/attendance.model.js');

const CreateAttendance = async (req, res) => {
    try {
        const { class_id, date, records } = req.body;
        if (!class_id || !date || !records) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingAttendance = await Attendance.findOne({ class_id, date });
        if (existingAttendance) {
            return res.status(409).json({ message: "Attendance already exists for this class and date" });
        }

        const newAttendance = new Attendance({
            class_id,
            date,
            records
        });

        if (newAttendance) {            
            await newAttendance.save();
            res.status(201).json(newAttendance);
        } else {
            return res.status(400).json({ message: "Attendance not created" });
        }

        // newAttendance.records.forEach(async (record) => {
        //     const student = await Student.findOne({ rollNumber: record.rollNumber });
        //     if (student) {
        //         student.attendance.push(newAttendance._id);
        //         await student.save();
        //     }
        // })

    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

module.exports = { CreateAttendance };
