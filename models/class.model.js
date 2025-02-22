const mongoose = require('mongoose');
const Student = require('./student.model');
const Schema = mongoose.Schema;

const classSchema = new Schema({
  classname: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  batch: {
    type: Number,
    required: true,
    index: true
  },
  semester: {
    type: Number,
    required: true,
    index: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  studentsId: [{
    type: Schema.Types.ObjectId,
    ref: 'Student',
    index: true
  }],
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher',
    index: true
  }
}, { timestamps: true });

classSchema.index({ batch: 1, semester: 1, department: 1 });

module.exports = mongoose.model('Class', classSchema);
