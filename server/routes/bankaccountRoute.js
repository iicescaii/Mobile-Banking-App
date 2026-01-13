const express = require("express");
const router = express.Router();
const pool = require("../config"); // Your MySQL pool connection

// GET /api/bank-accounts/:user_id
router.get("/:user_id", async (req, res) => {
  const userId = req.params.user_id;

  if (!userId) {
    return res.status(400).json({ success: false, message: "Missing user_id" });
  }

  try {
    const [rows] = await pool.promise().query(
      `SELECT account_id, account_type, balance, available_balance, account_label, account_number
       FROM bank_account
       WHERE user_id = ? AND status = 'Active'`,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching bank accounts:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
