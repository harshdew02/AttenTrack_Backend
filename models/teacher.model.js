const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the teacher schema
const teacherSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address'],
        trim: true
    },
    fullName: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'Class'
    }]
}, { timestamps: true });

// Create the model
const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
