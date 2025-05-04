require('dotenv').config({
    path: `.env.${process.env.NODE_ENV || 'development'}`
  });
  
  const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    dbUri: process.env.MONGODB_CONNECT_URI,
    jwtSecret: process.env.JWT_SECRET,
    saltRounds: parseInt(process.env.SALT_ROUND, 10),
    emailPassword: process.env.EMAIL_PASSWORD,
    emailID: "startupbubbles4@gmail.com",
  };
  
  module.exports = config;