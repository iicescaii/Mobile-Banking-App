const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const userModel = require('../model/userModel');
const sendOtpToUser = require('../services/sendOtp');
const { generateToken } = require('../utils/auth'); // ✅ Import from auth utility
const { verifyToken } = require('../utils/auth');
const { verifyTokenMiddleware } = require('../middleware/authMiddleware');

// Login Route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  userModel.getUserByUsername(username, async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Server error' });
    if (results.length === 0) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    userModel.updateLastLogin(user.login_id);

    const token = generateToken({ user_id: user.user_id });

    // Fetch user email and name separately before sending email notification
    userModel.getEmailByUserId(user.user_id, (emailErr, emailResult) => {
      if (emailErr || !emailResult.length) {
        console.warn('Email not found for user, skipping login notification email');
      } else {
        const email = emailResult[0].email;
        sendLoginNotification(email, null, (mailErr) => {
          if (mailErr) {
            console.error('Failed to send login notification email:', mailErr);
          } else {
            console.log('Login notification email sent');
          }
        });
      }
    });


    const needsOtp = user.terms_accepted === 0 || !user.pin;

    if (needsOtp) {
      sendOtpToUser(user.user_id, (err) => {
        if (err) {
          console.error('Failed to send OTP:', err);
          return res.status(500).json({ success: false, message: 'OTP failed to send' });
        }

        res.json({
          success: true,
          message: 'Login OK. OTP sent.',
          user_id: user.user_id,
          terms_accepted: user.terms_accepted,
          pin: user.pin,
          token,
        });
      });
    } else {
      res.json({
        success: true,
        message: 'Login OK. No OTP needed.',
        user_id: user.user_id,
        terms_accepted: user.terms_accepted,
        pin: user.pin,
        token,
      });
    }
  });
});


// Set PIN route
router.post('/set-pin', async (req, res) => {
  try {
    const { user_id, pin } = req.body;
    if (!user_id || !pin) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    await userModel.setUserPin(user_id, pin);
    res.json({ success: true, message: 'PIN set successfully' });
  } catch (err) {
    console.error('Failed to set PIN:', err);
    res.status(500).json({ success: false, message: 'Could not set PIN' });
  }
});

// Verify PIN route
router.post('/verify-pin', verifyTokenMiddleware, async (req, res) => {
  try {
    const { user_id, pin } = req.body;
    
    // Validate input
    if (!user_id || !pin) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Validate PIN format
    if (!/^\d{6}$/.test(pin)) {
      return res.status(400).json({ 
        success: false, 
        message: 'PIN must be 6 digits' 
      });
    }

    const isValid = await userModel.verifyUserPin(user_id, pin);
    
    if (!isValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid PIN' 
      });
    }

    res.json({ 
      success: true, 
      message: 'PIN verified successfully' 
    });
  } catch (err) {
    console.error('PIN verification error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to verify PIN' 
    });
  }
});

// Accept Terms
router.patch('/accept-terms', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    const user_id = decoded.user_id;

    userModel.updateTermsAccepted(user_id, (err) => {
      if (err) return res.status(500).json({ message: 'Update failed' });
      res.json({ message: 'Terms accepted successfully' });
    });
  } catch (err) {
    console.error('Token error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Get current user info
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    // Optionally, fetch more user info from DB using decoded.user_id
    res.json({ success: true, user: decoded });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
});

module.exports = router;