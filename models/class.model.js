const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classSchema = new Schema({
  classname: {
    type: String,
    required: true
  },
  batch: {
    type: String,
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
  sheet: {
    type: Schema.Types.ObjectId,
    ref: 'Sheet'
  }
});

module.exports = mongoose.model('Class', classSchema);
