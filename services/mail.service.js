const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const config = require('../config/config.js');

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: config.emailID,
        pass: config.emailPassword,
    },
});

const SendOTP = async (email, otp, student) => {
    try {
        let info = await transporter.sendMail({
            from: '"Startup Bubbles" <startupbubbles4@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "OTP for SignUp on AttenTrack", // Subject line
            html: `
        <div style="font-family: Arial, sans-serif; padding: 10px; border: 1px solid #ddd;">
            <h2 style="color: #007bff;">Your OTP for AttenTrack</h2>
            <p style="font-size: 16px;"><strong>OTP:</strong> <span style="font-size: 18px; color: #039c1f;">${otp}</span></p>
            <hr>
            <p style="font-size: 14px; color: #555;">
                <strong>Student:</strong> ${student.name}<br>
                <strong>Roll Number:</strong> ${student.rollNumber}
            </p>
            <p style="font-size: 12px; color: #d9534f;">If you did not request this, please ignore this email.</p>
        </div>
    `,
        });
        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = { SendOTP };
//                     otpToken: generateToken({ otp: otp }),