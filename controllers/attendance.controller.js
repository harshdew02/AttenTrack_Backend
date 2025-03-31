const Attendance = require('../models/attendance.model.js');

const CreateAttendance = async (req, res) => {
    try {
        const { class_id, date, records } = req.body;
        if (!class_id || !date || !records) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingAttendance = await Attendance.findOne({ class_id, date });
        if (existingAttendance) {

            const updatedAttendance = await Attendance.findOneAndUpdate(
                { class_id, date },
                { records }, // update with new records
                { new: true, upsert: true } // create if not found (upsert)
            );

            await updatedAttendance.save();

            return res.status(200).json({
                message: updatedAttendance ? "Attendance updated" : "Attendance created",
                attendance: updatedAttendance
            });
        }

        const newAttendance = new Attendance({
            class_id,
            date,
            records
        });

        if (newAttendance) {
            await newAttendance.save();

            return res.status(201).json({
                message:"Attendance created",
                attendance: newAttendance
            });

        } else {
            return res.status(400).json({ message: "Attendance not created" });
        }

    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

module.exports = { CreateAttendance };
