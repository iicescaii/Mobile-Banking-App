const express = require('express');
const router = express.Router();
const pool = require('../config');

// GET /api/card-details/:account_id
router.get('/:account_id', async (req, res) => {
  const { account_id } = req.params;
  console.log('🛬 Card details route hit with ID:', account_id);

  try {
    const [rows] = await pool.promise().query(
      `SELECT 
         ba.account_id,
         ba.card_number,
         ba.account_label,
         ba.account_type,
         ba.user_id,
         ba.is_locked,
         ba.overseas_disabled,
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
    console.error('❌ SQL error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/card-details/:account_id/toggles
router.put('/:account_id/toggles', async (req, res) => {
  const { account_id } = req.params;
  const { is_locked, overseas_disabled } = req.body;

  try {
    const [result] = await pool.promise().query(
      `UPDATE bank_account 
       SET is_locked = ?, overseas_disabled = ?
       WHERE account_id = ?`,
      [is_locked, overseas_disabled, account_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.json({ message: 'Card status updated successfully' });
  } catch (error) {
    console.error('❌ Update error:', error);
    res.status(500).json({ message: 'Failed to update card status' });
  }
});

module.exports = router;
