const mongoose = require('mongoose');

const sheetSchema = new mongoose.Schema({
  students: [
    {
      name: {
        type: String,
        required: true,
        trim: true
      },
      rollNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
      }
    }
  ]
});

const Sheet = mongoose.model('Sheet', sheetSchema);

module.exports = Sheet;
