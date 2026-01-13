const express = require('express');
const router = express.Router();
const deviceModel = require('../model/deviceModel'); // ✅ import device model

router.post('/register-device', (req, res) => {
  const { user_id, device_name, device_type, biometrics_enabled } = req.body;

  if (!user_id || !device_name || !device_type) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  deviceModel.registerDevice(user_id, device_name, device_type, biometrics_enabled, (err) => {
    if (err) {
      console.error('❌ Device registration failed:', err);
      return res.status(500).json({ success: false, message: 'Registration error' });
    }

    res.json({ success: true, message: 'Device registered successfully' });
  });
});

module.exports = router;
