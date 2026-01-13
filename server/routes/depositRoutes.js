const express = require('express');
const router = express.Router();
const pool = require('../config');

// 🔹 Get linked accounts
router.get('/linked-accounts', async (req, res) => {
  const { user_id } = req.query;

  try {
    const [rows] = await pool.promise().query(
      'SELECT * FROM linked_accounts WHERE user_id = ?',
      [user_id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching linked accounts:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/user-accounts', async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ message: 'Missing user_id' });

  try {
    const [rows] = await pool.promise().query(
      'SELECT account_id, account_label, available_balance FROM bank_account WHERE user_id = ?',
      [user_id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching user accounts:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/add-deposit', async (req, res) => {
  const { user_id, linked_account_id, account_id, amount } = req.body;

  console.log('Received deposit request:', { user_id, linked_account_id, account_id, amount });

  if (!user_id || !linked_account_id || !account_id || !amount || isNaN(amount)) {
    console.error('Validation failed: Missing or invalid fields');
    return res.status(400).json({ success: false, message: 'Missing required fields or invalid amount' });
  }

  const connection = await pool.promise().getConnection();

  try {
    await connection.beginTransaction();
    console.log('Transaction started');

    // Insert deposit record
    const [insertResult] = await connection.query(
      'INSERT INTO deposits (user_id, linked_account_id, amount, timestamp) VALUES (?, ?, ?, NOW())',
      [user_id, linked_account_id, amount]
    );
    console.log('Deposit record inserted:', insertResult);

    // Lock and fetch current balance for internal account
    const [rows] = await connection.query(
      'SELECT available_balance FROM bank_account WHERE user_id = ? AND account_id = ? FOR UPDATE',
      [user_id, account_id]
    );

    if (rows.length === 0) {
      throw new Error('Bank account not found');
    }

    const currentBalance = Number(rows[0].available_balance);
    const depositAmount = Number(amount);
    const newBalance = currentBalance + depositAmount;
    console.log(`Current balance: ${currentBalance}, Deposit amount: ${depositAmount}, New balance: ${newBalance}`);

    // Update the bank account balance
    const [updateResult] = await connection.query(
      'UPDATE bank_account SET available_balance = ? WHERE user_id = ? AND account_id = ?',
      [newBalance, user_id, account_id]
    );
    console.log('Bank account balance updated:', updateResult);

    await connection.commit();
    console.log('Transaction committed');

    res.json({ success: true, message: 'Deposit added and balance updated successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error adding deposit:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to add deposit' });
  } finally {
    connection.release();
  }
});



// 🔹 Link a bank account
router.post('/link-bank', async (req, res) => {
  const { user_id, bank_name, account_number } = req.body;

  if (!user_id || !bank_name || !account_number) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    // Check if the bank account is already linked
    const [existing] = await pool.promise().query(
      'SELECT * FROM linked_accounts WHERE user_id = ? AND bank_name = ?',
      [user_id, bank_name]
    );

    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Bank already linked' });
    }

    // Insert the new linked bank account
    const query = `
    INSERT INTO linked_accounts (user_id, bank_name, account_number, linked_at)
    VALUES (?, ?, ?, NOW())
    `;

    await pool.promise().query(query, [user_id, bank_name, account_number]);

    res.json({ success: true, message: 'Bank account linked successfully' });
  } catch (err) {
    console.error('Error linking bank:', err);
    res.status(500).json({ success: false, message: 'Failed to link bank' });
  }
});


module.exports = router;