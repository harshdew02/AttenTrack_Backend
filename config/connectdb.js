const mongoose = require('mongoose');
const config = require('./config.js');

const connectDB = async () => {
    try {
        await mongoose.connect(config.dbUri)
        console.log('connected to MongoDb successfully....')
    } catch (error) {
        console.log("error by db connection",error.message);
    }
}

module.exports = connectDB;
