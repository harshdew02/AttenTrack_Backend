const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });
}

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
}


module.exports = {
  generateToken,
  verifyToken
};


