const mongoose = require('mongoose');
const Student = require('./student.model');
const Schema = mongoose.Schema;

const classSchema = new Schema({

  classname: {
    type: String,
    required: true,
    unique: true
  },
  batch: {
    type: Number,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  studentsId: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }],
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher'
  },

});

module.exports = mongoose.model('Class', classSchema);
