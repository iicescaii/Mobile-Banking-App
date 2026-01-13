const express = require('express');
const router = express.Router();
const otpModel = require('../model/otpModel');
const sendOtpToUser = require('../services/sendOtp');
const db = require('../config');
const { generateToken } = require('../utils/auth'); // ✅ Use shared auth utility

// POST /api/send-otp
router.post('/send-otp', (req, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(400).json({ success: false, message: 'Missing user_id' });
  }

  sendOtpToUser(user_id, (err) => {
    if (err) {
      console.error('❌ Error sending OTP:', err);
      return res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }

    res.json({ success: true, message: 'OTP sent successfully' });
  });
});

// POST /api/verify-otp
router.post('/verify-otp', (req, res) => {
  const { user_id, otp } = req.body;
  if (!user_id || !otp) {
    return res.status(400).json({ success: false, message: 'Missing parameters' });
  }

  otpModel.verifyOtp(user_id, otp, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Server error' });
    if (!results.length) return res.status(401).json({ success: false, message: 'Invalid or expired OTP' });

    const query = 'SELECT terms_accepted, pin FROM user_login WHERE user_id = ? LIMIT 1';
    db.query(query, [user_id], (err2, userResult) => {
      if (err2) return res.status(500).json({ success: false, message: 'Error fetching user data' });

      const user = userResult[0];
      const termsAccepted = user.terms_accepted;
      const pin = user.pin;

      // ✅ Generate JWT
      const token = generateToken({ user_id });

      res.json({
        success: true,
        message: 'OTP verified successfully',
        user_id,
        terms_accepted: termsAccepted,
        pin,
        token, // 🔐 Send token to frontend
      });
    });
  });
});

module.exports = router;
