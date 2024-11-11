// require('dotenv').config()
const mongoose = require('mongoose');

// module.export   = connectDB

const connectDB = async (DATABASE_URL) => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT_URI)
        console.log('connected to MongoDb successfully....')
    } catch (error) {
        console.log("error by db connection",error.message);
    }
}

module.exports = connectDB;
