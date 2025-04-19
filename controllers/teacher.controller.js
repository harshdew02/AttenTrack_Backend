const Teacher = require("../models/teacher.model.js");
const Student = require("../models/student.model.js");
const Class = require("../models/class.model.js");
const Attendance = require("../models/attendance.model.js");
const { generateToken } = require("../services/token.service.js");
const bcrypt = require("bcryptjs");
const { SendOTP } = require("../services/mail.service.js");

const VerifyOTP = async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });

    console.log(teacher);

    if (teacher) {
      teacher.password = password;

      await teacher.save();

      let token = generateToken({ id: teacher._id });

      return res.status(200).json({
        id: teacher._id,
        email: teacher.email,
        fullName: teacher.fullName,
        password: teacher.password,
        department: teacher.department,
        coursesId: teacher.courses,
        eduQualification: teacher.eduQualification,
        telephone: teacher.telephone,
        interest: teacher.interest,
        token: token,
      });
    } else {
      return res
        .status(404)
        .json({ error: "Not found please tell your teacher to add in sheet" });
    }
  } catch (err) {
    console.log("Error in teacherRegistration", err.message);
    console.log(err);
    res.status(500).send(err.message);
  }
};

const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.status(400).json({ error: "Teacher not found" });
    }

    teacher.password = "any";

    await teacher.save();
    res.status(200).json({ message: "Password resetted successfully" });
  } catch (err) {
    console.error("Error updating password:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const ChangePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.status(400).json({ error: "Teacher not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, teacher.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    teacher.password = newPassword;
    await teacher.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error changing password:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const generateOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const teacher = await Teacher.findOne({ email });

    if (teacher) {
      const otp = Math.floor(100000 + Math.random() * 900000);

      const send = {
        name: teacher.fullName,
        email: teacher.email,
      };

      await SendOTP(email, otp, send);

      return res.status(200).json({
        otpToken: generateToken({ otp: otp }),
        tempOtp: otp,
      });
    } else {
      return res.status(404).json({
        error: "Teacher not found",
      });
    }
  } catch (err) {
    console.log("Error in generating OTP", err.message);
    console.log(err);
    res.status(500).send(err.message);
  }
};

const TeacherRegistration = async (req, res) => {
  try {
    const { email } = req.body;
    const teacher = await Teacher.findOne({ email });

    if (teacher) {
      if (await bcrypt.compare("any", teacher.password)) {
        const otp = Math.floor(100000 + Math.random() * 900000);

        const send = {
          name: teacher.fullName,
          email: teacher.email,
        };

        await SendOTP(email, otp, send);

        return res.status(200).json({
          otpToken: generateToken({ otp: otp }),
          tempOtp: otp,
        });
      } else {
        return res.status(403).json({
          error:
            "Teacher already registered please login or do forget password",
        });
      }
    } else {
      return res.status(404).json({
        error: "Not found please tell the super admin to add in Teacher sheet",
      });
    }
  } catch (err) {
    console.log("Error in TeacherRegistration", err.message);
    console.log(err);
    res.status(500).send(err.message);
  }
};

const UpdateTeacher = async (req, res) => {
  try {
    const { email, eduQualification, telephone, interest } = req.body;
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    teacher.eduQualification = eduQualification || teacher.eduQualification;
    teacher.telephone = telephone || teacher.telephone;
    teacher.interest = interest || teacher.interest;

    await teacher.save();

    res.status(200).json({ message: "Teacher updated successfully" });
  } catch (err) {
    console.error("Error updating teacher:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const TeacherLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.status(400).json({ error: "teacher not found" });
    }

    if (await bcrypt.compare("any", teacher.password)) {
      return res.status(400).json({
        error:
          "teacher not registered please tell your teacher to add in sheet",
      });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    let token = generateToken({ id: teacher._id });

    return res.status(200).json({
      id: teacher._id,
      email: teacher.email,
      fullName: teacher.fullName,
      password: teacher.password,
      department: teacher.department,
      coursesId: teacher.courses,
      eduQualification: teacher.eduQualification,
      telephone: teacher.telephone,
      interest: teacher.interest,
      token: token,
    });
  } catch (err) {
    console.log("Error in Teacher Login", err.message);
    console.log(err);
    res.status(500).send(err.message);
  }
};

const GetClasses = async (req, res) => {
  try {
    const teacherdata = await Teacher.findById(req.params.teacher_id);

    if (!teacherdata) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    let classes = [];

    for (const classId of teacherdata.courses) {
      const classData = await Class.findById(classId);
      if (classData) {
        let classInfo = {
          classname: classData.classname,
          batch: classData.batch,
          semester: classData.semester,
          department: classData.department,
          class_id: classData._id,
          student_count: classData.studentsId.length,
        };
        classes.push(classInfo);
      }
    }

    let body = {
      teacher_id: teacherdata._id,
      teacher_email: teacherdata.email,
      teacher_name: teacherdata.fullName,
      department: teacherdata.department,
      classes: classes,
    };

    res.json(body);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getReportHelper = async (attendanceRecords) => {
  const rollNumbersSet = new Set();

  for (const record of attendanceRecords) {
    for (const rollNumber of record.records.keys()) {
      rollNumbersSet.add(rollNumber);
    }
  }

  const rollNumbers = Array.from(rollNumbersSet);

  const students = await Student.find({ rollNumber: { $in: rollNumbers } });

  // Step 3: Create a lookup map for rollNumber → fullName
  const studentMap = new Map();
  students.forEach((student) => {
    studentMap.set(student.rollNumber, {
      name: student.fullName,
      email: student.email,
    });
  });

  return studentMap;
};

const getReport = async (req, res) => {
  try {
    const { class_id, startDate, endDate } = req.body;

    if (!class_id || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const attendanceRecords = await Attendance.find({
      class_id,
      date: { $gte: start, $lte: end },
    });

    let report = {};
    const totalDays = attendanceRecords.length;

    const studentMap = await getReportHelper(attendanceRecords);

    attendanceRecords.forEach((record) => {
      record.records.forEach((present, rollNumber) => {
        if (!report[rollNumber]) {
          report[rollNumber] = {
            totalDays,
            presentCount: 0,
            name: studentMap.get(rollNumber).name || "Unknown",
            email: studentMap.get(rollNumber).email || "Unknown",
          };
        }
        if (present) {
          report[rollNumber].presentCount++;
        }
      });
    });

    res.json({ class_id, totalDays, report });
  } catch (error) {
    console.error("Error fetching attendance report:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

const OverallRecords = async (req, res) => {
  try {
    const { startDate, endDate, class_id } = req.body;

    if (!startDate || !endDate || !class_id) {
      return res
        .status(400)
        .json({ error: "Missing startDate, endDate or class id" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // Fetch records that match the class and date range
    const attendanceRecords = await Attendance.find({
      class_id,
      date: { $gte: start, $lte: end },
    });

    // console.log(attendanceRecords)

    const stats = attendanceRecords.map((record) => {
      let presentCount = 0;
      let absentCount = 0;

      record.records.forEach((present) => {
        if (present) {
          presentCount++;
        } else {
          absentCount++;
        }
      });

      const d = new Date(record.date);
      const formattedDate = `${String(d.getDate()).padStart(2, "0")}-${String(
        d.getMonth() + 1
      ).padStart(2, "0")}-${String(d.getFullYear()).slice(-2)}`;
      const formattedTime = `${String(d.getHours()).padStart(2, "0")}:${String(
        d.getMinutes()
      ).padStart(2, "0")}`;

      return {
        date: formattedDate,
        time: formattedTime,
        id: record._id.toString(),
        presentCount,
        absentCount,
      };
    });

    res.status(200).json(stats);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to fetch filtered attendance stats" });
  }
};

module.exports = {
  TeacherRegistration,
  TeacherLogin,
  getReport,
  VerifyOTP,
  GetClasses,
  ForgotPassword,
  ChangePassword,
  generateOTP,
  UpdateTeacher,
  OverallRecords
};
