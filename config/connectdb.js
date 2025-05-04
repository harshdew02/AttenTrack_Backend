const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT_URI)
        console.log('connected to MongoDb successfully....')
    } catch (error) {
        console.log("error by db connection",error.message);
    }
}

module.exports = connectDB;
