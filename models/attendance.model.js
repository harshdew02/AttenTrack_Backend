const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
  class_id: {
    type: Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  records: {
    type: Map,
    of: Boolean, // Roll number -> true/false (present/absent)
    required: true
  }
}, { timestamps: true });

attendanceSchema.index({ class_id: 1, date: 1 });


module.exports = mongoose.model('Attendance', attendanceSchema);
