const Attendance = require("../models/attendance.model.js");

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
        message: updatedAttendance
          ? "Attendance updated"
          : "Attendance created",
        attendance: updatedAttendance,
      });
    }

    const newAttendance = new Attendance({
      class_id,
      date,
      records,
    });

    if (newAttendance) {
      await newAttendance.save();

      return res.status(201).json({
        message: "Attendance created",
        attendance: newAttendance,
      });
    } else {
      return res.status(400).json({ message: "Attendance not created" });
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const GetAttendance = async (req, res) => {
  try {
    const attendance_id = req.query.id;
    if (!attendance_id) {
      return res.status(400).json({ error: "Missing attendance_id" });
    }
    const attendanceRecord = await Attendance.findOne({ _id: attendance_id });
    if (!attendanceRecord) {
      return res.status(400).json({ error: "Attendance record not found" });
    }
    return res.status(200).json(attendanceRecord.records);
  } catch (error) {
    console.error("Error fetching specific attendance record:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

const ModifyAttendance = async (req, res) => {
  try {
    const { attendance_id, datas } = req.body;

    if (!attendance_id || !Array.isArray(datas)) {
      return res
        .status(400)
        .json({ error: "Missing attendance_id or datas array" });
    }

    const attendanceRecord = await Attendance.findOne({ _id: attendance_id });

    if (!attendanceRecord) {
      return res.status(400).json({ error: "Attendance record not found" });
    }

    datas.forEach((rollNumber) => {
      attendanceRecord.records.set(
        rollNumber,
        !attendanceRecord.records.get(rollNumber)
      );
    });

    await attendanceRecord.save();

    res.status(200).json({ message: "Attendance updated successfully" });
  } catch (error) {
    console.error("Error updating specific attendance record:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

const DeleteAttendance = async (req, res) => {
  try {
    const attendance_id = req.query.id;
    if (!attendance_id) {
      return res.status(400).json({ message: "No attendance are provided" });
    }

    const attendance = await Attendance.findOneAndDelete({
      _id: attendance_id,
    });
    if (!attendance) {
      return res.status(400).json({ message: "Attendance not found" });
    }

    return res
      .status(204)
      .json({ message: "Selected attendance record deleted" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

module.exports = { CreateAttendance, GetAttendance, ModifyAttendance, DeleteAttendance };
