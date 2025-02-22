const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
  class_id: {
    type: Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  records: {
    type: Map,
    of: Boolean, // Roll number -> true/false (present/absent)
    required: true
  }
}, { timestamps: true });


module.exports = mongoose.model('Attendance', attendanceSchema);
