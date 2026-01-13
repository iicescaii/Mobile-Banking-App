const express = require('express');
const pool = require('../config');
const router = express.Router();

// Route to fetch bank accounts based on the logged-in user (user_id)
router.get('/bankaccounts', async (req, res) => {
  const userId = req.query.user_id; // Get user_id from query parameter
  
  if (!userId) {
    return res.status(400).json({ success: false, message: 'User ID is required' });
  }

  try {
    const [rows] = await pool.promise().query(
      'SELECT account_id, account_label, account_number FROM bank_account WHERE user_id = ? AND status = "Active"',
      [userId]
    );
    if (rows.length > 0) {
      res.json({ success: true, accounts: rows });
    } else {
      res.status(404).json({ success: false, message: 'No bank accounts found for this user' });
    }
  } catch (error) {
    console.error('Error fetching bank accounts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch bank accounts' });
  }
});

router.post('/transaction', async (req, res) => {
  const { sendTo, sendFrom, amount, notes, userId } = req.body;

  const parsedAmount = Number(amount);
  if (!sendTo || !sendFrom || !amount || isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid input data' });
  }

  const connection = await pool.promise().getConnection();

  try {
    await connection.beginTransaction();

    // Fetch and lock both accounts at once for update to avoid race conditions
    const [accounts] = await connection.query(
      `SELECT account_id, account_number, available_balance 
       FROM bank_account 
       WHERE account_number IN (?, ?) AND status = "Active" 
       FOR UPDATE`,
      [sendFrom, sendTo]
    );

    if (accounts.length !== 2) {
      throw new Error('One or both accounts not found');
    }

    const fromAccount = accounts.find(acc => acc.account_number === sendFrom);
    const toAccount = accounts.find(acc => acc.account_number === sendTo);

    if (!fromAccount) throw new Error('Send From account not found');
    if (!toAccount) throw new Error('Send To account not found');

    if (Number(fromAccount.available_balance) < parsedAmount) {
      throw new Error('Insufficient funds');
    }

    const newFromBalance = Math.round((Number(fromAccount.available_balance) - parsedAmount) * 100) / 100;
    const newToBalance = Math.round((Number(toAccount.available_balance) + parsedAmount) * 100) / 100;

    console.log(`Updating sender balance: ${fromAccount.available_balance} -> ${newFromBalance} for account_id ${fromAccount.account_id}`);
    const [updateFromResult] = await connection.query(
      'UPDATE bank_account SET available_balance = ? WHERE account_id = ?',
      [newFromBalance, fromAccount.account_id]
    );
    if (updateFromResult.affectedRows === 0) {
      throw new Error('Failed to update sender balance');
    }

    console.log(`Updating receiver balance: ${toAccount.available_balance} -> ${newToBalance} for account_id ${toAccount.account_id}`);
    const [updateToResult] = await connection.query(
      'UPDATE bank_account SET available_balance = ? WHERE account_id = ?',
      [newToBalance, toAccount.account_id]
    );
    if (updateToResult.affectedRows === 0) {
      throw new Error('Failed to update receiver balance');
    }

    // Insert transaction record
    await connection.query(
      'INSERT INTO sendtoown (send_from, send_to, amount, notes, transaction_status) VALUES (?, ?, ?, ?, ?)',
      [fromAccount.account_id, toAccount.account_id, parsedAmount, notes, 'Completed']
    );

    await connection.commit();

    res.json({ success: true, message: 'Transaction created successfully' });

  } catch (error) {
    await connection.rollback();
    console.error('Error processing transaction:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to process the transaction' });
  } finally {
    connection.release();
  }
});


module.exports = router;
