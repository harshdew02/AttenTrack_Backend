const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the teacher schema
const teacherSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address'],
        trim: true,
        lowercase: true,
        index: true // Index for fast email lookups
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true,
        index: true // Index for department-wise queries
    },
    password: {
        type: String,
        required: true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        index: true // Index for efficient course-based lookups
    }]
}, { timestamps: true });

// Compound index for department & email (common query pattern)
teacherSchema.index({ department: 1, email: 1 });

// Create the model
const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
