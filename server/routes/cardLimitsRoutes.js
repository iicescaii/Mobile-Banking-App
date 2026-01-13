const express = require('express');
const router = express.Router();
const pool = require('../config'); // mysql2 

// GET: Fetch card limits
router.get('/account/:accountId', (req, res) => {
  const { accountId } = req.params;
  console.log('🔍 Incoming accountId:', accountId);

  pool.query(
    'SELECT card_number, account_label FROM bank_account WHERE account_id = ?',
    [accountId],
    (err, accountResults) => {
      if (err) return res.status(500).json({ message: 'Server error (account)' });
      if (accountResults.length === 0) return res.status(404).json({ message: 'Account not found' });

      pool.query(
        'SELECT limit_type, limit_value FROM card_limits WHERE account_id = ?',
        [accountId],
        (err, limitResults) => {
          if (err) return res.status(500).json({ message: 'Server error (limits)' });

          const limits = {};
          limitResults.forEach(row => {
            limits[row.limit_type] = row.limit_value;
          });

          res.json({
            card_number: accountResults[0].card_number,
            account_label: accountResults[0].account_label,
            limits,
          });
        }
      );
    }
  );
});

// PUT: Update card limits
router.put('/account/:accountId', (req, res) => {
  const { accountId } = req.params;
  const { limits } = req.body;

  if (!limits || typeof limits !== 'object') {
    return res.status(400).json({ message: 'Invalid limits data' });
  }

  const updates = Object.entries(limits);
  const updatePromises = updates.map(([limitType, limitValue]) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE card_limits SET limit_value = ?, updated_at = NOW() WHERE account_id = ? AND limit_type = ?',
        [limitValue, accountId, limitType],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  });

  Promise.all(updatePromises)
    .then(() => res.json({ message: 'Limits updated successfully' }))
    .catch(error => {
      console.error('❌ Error updating limits:', error);
      res.status(500).json({ message: 'Server error' });
    });
});

module.exports = router;
