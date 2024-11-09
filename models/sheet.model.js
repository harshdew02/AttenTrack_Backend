const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sheetSchema = new Schema({
  roll_number: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Sheet', sheetSchema);
