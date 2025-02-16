const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
    trim: true
  },
  fullName: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  courses: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Class'
  },
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
