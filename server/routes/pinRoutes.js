const express = require("express");
const router = express.Router();
const pool = require("../config");
const bcrypt = require('bcrypt');

router.post("/verify-pin", (req, res) => {
  const { user_id, pin } = req.body;

  if (!user_id || !pin) {
    return res.status(400).json({ success: false, message: "Missing user ID or PIN" });
  }

  const query = `SELECT pin FROM user_login WHERE user_id = ?`;

  pool.query(query, [user_id], async (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const hashedPin = results[0].pin;

    const isMatch = await bcrypt.compare(pin, hashedPin);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid PIN" });
    }

    return res.json({ success: true, message: "PIN verified" });
  });
});




module.exports = router;
