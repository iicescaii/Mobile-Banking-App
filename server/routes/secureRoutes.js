const express = require('express');
const router = express.Router();
const { verifyTokenMiddleware } = require('../middleware/authMiddleware'); // ✅ update import

// ✅ Protected route
router.get('/secure-data', verifyTokenMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid!',
    user_id: req.user.user_id,
  });
});

module.exports = router;
