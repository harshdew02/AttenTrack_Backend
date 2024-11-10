const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
  sheet_id: {
    type: Schema.Types.ObjectId,
    ref: 'Sheet',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  records: [{
    rollNumber: {
      type: String,
      required: true
    },
    is_present: {
      type: Boolean,
      required: true
    }
  }]
});

module.exports = mongoose.model('Attendance', attendanceSchema);
