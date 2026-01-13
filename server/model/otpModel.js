// === /model/otpModel.js ===
const db = require('../config');

// Save a new OTP
const saveOtp = async (user_id, otp) => {
  try {
    const sql = 'INSERT INTO otp_table (user_id, otp, created_at) VALUES (?, ?, NOW())';
    await db.query(sql, [user_id, otp]);
  } catch (err) {
    throw err;
  }
};

// Verify OTP (check if it exists and is recent)
const verifyOtp = async (user_id, otp) => {
  try {
    const sql = `
      SELECT * FROM otp_table
      WHERE user_id = ? AND otp = ? AND created_at >= NOW() - INTERVAL 3 MINUTE
      ORDER BY created_at DESC
      LIMIT 1`;
    const [rows] = await db.query(sql, [user_id, otp]);
    return rows;
  } catch (err) {
    throw err;
  }
};

// Get email of user by user_id
const getEmailByUserId = async (user_id) => {
  try {
    const sql = 'SELECT email FROM user_profile WHERE user_id = ? LIMIT 1';
    const [rows] = await db.query(sql, [user_id]);
    return rows;
  } catch (err) {
    throw err;
  }
};

// Delete old OTPs for a user
const deleteOldOtps = async (user_id) => {
  try {
    const sql = 'DELETE FROM otp_table WHERE user_id = ?';
    await db.query(sql, [user_id]);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  saveOtp,
  verifyOtp,
  getEmailByUserId,
  deleteOldOtps
};