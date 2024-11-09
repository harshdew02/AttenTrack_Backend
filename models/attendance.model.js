const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
  date: [{
    date: {
      type: Date,
      required: true
    },
    records: [{
      sheet_id: {
        type: Schema.Types.ObjectId,
        ref: 'Sheet',
        required: true
      },
      is_present: {
        type: Boolean,
        required: true
      }
    }]
  }]
});

module.exports = mongoose.model('Attendance', attendanceSchema);
