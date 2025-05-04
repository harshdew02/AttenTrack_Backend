const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const config = require('../config/config.js');

const studentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address'],
    trim: true,
    lowercase: true,
    index: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  batch: {
    type: Number, // If batch is a year (e.g., 2025)
    required: true,
    index: true
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }],
  branch: {
    type: String,
    required: false,
    default: "Not Set",
    trim: true,
    set: (value) => value.trim() === "" ? "Not Set" : value.trim()
  },
  semester: {
    type: String,
    required: false,
    default: "Not Set",
    trim: true,
    set: (value) => value.trim() === "" ? "Not Set" : value.trim()
  },
  enroll: {
    type: String,
    required: false,
    default: "Not Set",
    trim: true,
    set: (value) => value.trim() === "" ? "Not Set" : value.trim()
  },
  phone: {
    type: String,
    required: false,
    default: "Not Set",
    trim: true,
    set: (value) => value.trim() === "" ? "Not Set" : value.trim()
  },
  auth:{
    type: Boolean,
    default: false
  }
}, { timestamps: true });

studentSchema.pre('save',async function (next) {

  const student = this;
  
  if (!student.isModified('password'))
    return next();
  try {
    const saltRound = await bcrypt.genSalt(config.saltRounds);
    const hash_password = await bcrypt.hash(student.password, saltRound);
    student.password = hash_password;
    next();
  } catch (error) {
    next(error);
  }

});

studentSchema.index({ batch: 1, rollNumber: 1 });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
