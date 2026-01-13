// server/utils/auth.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'asdasd'; // Fallback to hardcoded value if env var not set

const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

module.exports = { generateToken, verifyToken };
