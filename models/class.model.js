const mongoose = require('mongoose');
const Student = require('./student.model');
const Schema = mongoose.Schema;

const classSchema = new Schema({

  classname: {
    type: String,
    required: true
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
  // sheet: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Sheet'
  // },
  students: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    rollNumber: {
      type: String,
      required: true,
      trim: true
    }
  }],
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher'
  },

});

module.exports = mongoose.model('Class', classSchema);
