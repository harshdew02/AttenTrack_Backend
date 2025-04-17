const Student = require("../models/student.model.js");
const Class = require("../models/class.model.js");
const Attendance = require("../models/attendance.model.js");
const Teacher = require("../models/teacher.model.js");
const { generateToken } = require("../services/token.service.js");
const bcrypt = require("bcryptjs");
const { SendOTP } = require("../services/mail.service.js");

const ForgotPassword = async (req, res) => {
  try {
    const { rollNumber } = req.body;
    const student = await Student.findOne({ rollNumber });

    if (!student) {
      return res.status(400).json({ error: "Student not found" });
    }

    student.password = "any";

    await student.save();
    res.status(200).json({ message: "Password resetted successfully" });
  } catch (err) {
    console.error("Error updating password:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const generateOTP = async (req, res) => {
  try {
    const { rollNumber } = req.body;
    const student = await Student.findOne({ rollNumber });

    if (student) {
      const otp = Math.floor(100000 + Math.random() * 900000);

      const send = {
        name: student.fullName,
        rollNumber: student.rollNumber,
      };

      await SendOTP(student.email, otp, send);

      return res.status(200).json({
        otpToken: generateToken({ otp: otp }),
        tempOtp: otp,
      });
    } else {
      return res.status(404).json({
        error: "Student not found",
      });
    }
  } catch (err) {
    console.log("Error in generating OTP", err.message);
    console.log(err);
    res.status(500).send(err.message);
  }
};

const VerifyOTP = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });

    if (student) {
      student.password = password;

      await student.save();

      let token = generateToken({ id: student._id });

      return res.status(201).json({
        id: student._id,
        email: student.email,
        fullName: student.fullName,
        rollNumber: student.rollNumber,
        password: student.password,
        batch: student.batch,
        coursesId: student.courses,
        branch: student.branch,
        semester: student.semester,
        phone: student.phone,
        enroll: student.enroll,
        token: token,
      });
    } else {
      return res
        .status(404)
        .json({ error: "Not found please tell your teacher to add in sheet" });
    }
  } catch (err) {
    console.log("Error in StudentRegistration", err.message);
    console.log(err);
    res.status(500).send(err.message);
  }
};

const StudentRegistration = async (req, res) => {
  try {
    const { email } = req.body;

    const student = await Student.findOne({ email });

    if (student) {
      if (await bcrypt.compare("any", student.password)) {
        const otp = Math.floor(100000 + Math.random() * 900000);

        const send = {
          name: student.fullName,
          rollNumber: student.rollNumber,
        };

        await SendOTP(email, otp, send);

        return res.status(200).json({
          otpToken: generateToken({ otp: otp }),
          tempOtp: otp,
        });
      } else {
        return res.status(403).json({
          error:
            "Student already registered please login or do forget password",
        });
      }
    } else {
      return res.status(404).json({
        error: "Not found please tell your teacher to add in Class sheet",
      });
    }
  } catch (err) {
    console.log("Error in StudentRegistration", err.message);
    console.log(err);
    res.status(500).send(err.message);
  }
};

const ChangePassword = async (req, res) => {
  try {
    const { rollNumber, oldPassword, newPassword } = req.body;
    const student = await Student.findOne({ rollNumber });

    if (!student) {
      return res.status(400).json({ error: "Student not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, student.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    student.password = newPassword;
    await student.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error changing password:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const StudentLogin = async (req, res) => {
  try {
    const { rollNumber, password } = req.body;
    const student = await Student.findOne({ rollNumber });

    if (!student) {
      return res.status(400).json({ error: "Student not found" });
    }

    if (await bcrypt.compare("any", student.password)) {
      return res.status(400).json({ error: "Please do sign up first" });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    let token = generateToken({ id: student._id });

    return res.status(201).json({
      id: student._id,
      email: student.email,
      fullName: student.fullName,
      rollNumber: student.rollNumber,
      password: student.password,
      batch: student.batch,
      coursesId: student.courses,
      branch: student.branch,
      semester: student.semester,
      phone: student.phone,
      enroll: student.enroll,
      token: token,
    });
  } catch (err) {
    console.log("Error in StudentLogin", err.message);
    console.log(err);
    res.status(500).send(err.message);
  }
};

const UpdateStudent = async (req, res) => {
  try {
    const { rollNumber, branch, semester, enroll, phone } = req.body;
    const student = await Student.findOne({ rollNumber });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    student.branch = branch || student.branch;
    student.semester = semester || student.semester;
    student.enroll = enroll || student.enroll;
    student.phone = phone || student.phone;

    await student.save();

    res.status(200).json({ message: "Student updated successfully" });
  } catch (err) {
    console.error("Error updating student:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const EnrolledClasses = async (req, res) => {
  try {
    const studentdata = await Student.findById(req.params.student_id);

    if (!studentdata) {
      return res.status(404).json({ message: "Student not found" });
    }

    let classes = [];

    for (const classId of studentdata.courses) {
      const classData = await Class.findById(classId);
      if (classData) {
        let classInfo = {
          class_id: classData._id,
          classname: classData.classname,
          batch: classData.batch,
          semester: classData.semester,
          department: classData.department,
          student_count: classData.studentsId.length,
        };
        classes.push(classInfo);
      }
    }

    let body = {
      student_id: studentdata._id,
      fullName: studentdata.fullName,
      rollNumber: studentdata.rollNumber,
      email: studentdata.email,
      classes: classes,
    };

    res.json(body);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const GetAttandaces = async (req, res) => {
  try {
    const { class_id, rollNumber } = req.body;

    if (!class_id || !rollNumber) {
      return res
        .status(400)
        .json({ message: "class_id and rollNumber are required" });
    }

    const totalClasses = await Attendance.countDocuments({ class_id });
    const presentClasses = await Attendance.countDocuments({
      class_id,
      [`records.${rollNumber}`]: true,
    });

    const attendanceRecords = await Attendance.find(
      { class_id },
      "date records"
    );
    
    const attendanceMap = [];

    
    attendanceRecords.forEach((record) => {
      const d = new Date(record.date);
      const formattedDate = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getFullYear()).slice(-2)}`;
      const formattedTime = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      attendanceMap.push({date: formattedDate,time:formattedTime, status: record.records.get(rollNumber) || false})
    });

    res.json({ totalClasses, presentClasses, attendanceMap });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const GetAllAttendance = async (req, res) => {
  try {
    const { rollNumber } = req.params;

    if (!rollNumber) {
      return res.status(400).json({ message: "rollNumber is required" });
    }

    const student = await Student.findOne({ rollNumber });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const attendanceSummary = {};

    for (const class_id of student.courses) {
      const totalClasses = await Attendance.countDocuments({ class_id });
      const presentClasses = await Attendance.countDocuments({
        class_id,
        [`records.${rollNumber}`]: true,
      });

      attendanceSummary[class_id] = {
        total_days: totalClasses,
        attended: presentClasses,
      };
    }

    res.json(attendanceSummary);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  StudentRegistration,
  StudentLogin,
  EnrolledClasses,
  GetAttandaces,
  VerifyOTP,
  GetAllAttendance,
  ForgotPassword,
  ChangePassword,
  generateOTP,
  UpdateStudent,
};
