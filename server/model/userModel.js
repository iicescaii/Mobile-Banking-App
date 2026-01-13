// userModel.js
const db = require('../config');
const bcrypt = require('bcrypt');

// Get user by username
const getUserByUsername = async (username) => {
  try {
    const [rows] = await db.query('SELECT * FROM user_login WHERE username = ? LIMIT 1', [username]);
    return rows;
  } catch (err) {
    throw err;
  }
};

// Update last login timestamp
const updateLastLogin = async (login_id) => {
  try {
    await db.query('UPDATE user_login SET last_login_at = NOW() WHERE login_id = ?', [login_id]);
  } catch (err) {
    console.error('Failed to update last_login_at:', err);
    throw err;
  }
};

// Update terms_accepted to 1
const updateTermsAccepted = async (user_id) => {
  try {
    await db.query('UPDATE user_login SET terms_accepted = 1 WHERE user_id = ?', [user_id]);
  } catch (err) {
    throw err;
  }
};

// Hash and save new PIN
const setUserPin = async (user_id, plainPin) => {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(plainPin, saltRounds);
    await db.query('UPDATE user_login SET pin = ? WHERE user_id = ?', [hash, user_id]);
  } catch (err) {
    throw err;
  }
};

// User model function for PIN verification
const verifyUserPin = async (user_id, inputPin) => {
  // Input validation
  if (!user_id || !inputPin) {
    throw new Error('Missing required fields');
  }

  // Log the attempt
  console.log('Attempting to verify PIN for user:', user_id);

  try {
    const [rows] = await db.query('SELECT pin FROM user_login WHERE user_id = ? LIMIT 1', [user_id]);

    if (rows.length === 0) {
      console.log('User not found:', user_id);
      throw new Error('User not found');
    }

    const hashedPin = rows[0].pin;
    if (!hashedPin) {
      console.log('No PIN found for user:', user_id);
      throw new Error('No PIN set for user');
    }

    // Compare the PINs
    const match = await bcrypt.compare(inputPin, hashedPin);
    console.log('PIN comparison result for user:', user_id, 'Match:', match);
    return match;
  } catch (err) {
    console.error('Error during PIN verification:', err);
    throw err;
  }
};

const getEmailByUserId = (user_id, callback) => {
  const sql = 'SELECT email FROM user_profile WHERE user_id = ? LIMIT 1';
  db.query(sql, [user_id], callback);
};


module.exports = {
  getUserByUsername,
  updateLastLogin,
  updateTermsAccepted,
  setUserPin,
  verifyUserPin,
  getEmailByUserId,
};