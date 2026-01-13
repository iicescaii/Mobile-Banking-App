// routes/cards.js
const express = require('express');
const router = express.Router();
const pool = require('../config');

// GET cards linked to a user
router.get('/cards', async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ message: 'Missing user_id' });

  try {
    const [rows] = await pool.promise().query(
      'SELECT account_id, card_number, account_label, account_type FROM bank_account WHERE user_id = ? AND card_number IS NOT NULL',
      [user_id]
    );
    res.json({ cards: rows });
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// 🔹 GET card details by account_id
router.get('/cards/details/:account_id', async (req, res) => {
  const { account_id } = req.params;

  try {
    const [rows] = await pool.promise().query(
      `SELECT 
         ba.account_id,
         ba.card_number,
         ba.account_label,
         ba.account_type,
         ba.user_id,
         CONCAT(up.first_name, ' ', up.last_name) AS cardholder_name
       FROM bank_account ba
       JOIN user_profile up ON ba.user_id = up.user_id
       WHERE ba.account_id = ?`,
      [account_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching card details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
