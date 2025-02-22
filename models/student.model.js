const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address'],
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
  }]
}, { timestamps: true });

studentSchema.index({ batch: 1, rollNumber: 1 });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
