const express = require('express');
const router = express.Router();
const db = require('../config'); // mysql2/promise connection
const { verifyTokenMiddleware } = require('../middleware/authMiddleware');
const { v4: uuidv4 } = require('uuid');


// POST /api/transaction
router.post('/transaction', verifyTokenMiddleware, async (req, res) => {
  const { sendTo, sendFrom, amount, notes } = req.body;
  const userId = req.user.user_id; // From JWT

  if (!sendTo || !sendFrom || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid input' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Check if sender has enough balance
    const [fromRows] = await conn.query(
      'SELECT balance FROM bank_account WHERE account_number = ? AND user_id = ? FOR UPDATE',
      [sendFrom, userId]
    );
    if (!fromRows.length) {
      throw new Error('Sender account not found');
    }
    if (fromRows[0].balance < amount) {
      throw new Error('Insufficient funds');
    }

    // 2. Deduct from sender
    await conn.query(
      'UPDATE bank_account SET balance = balance - ? WHERE account_number = ? AND user_id = ?',
      [amount, sendFrom, userId]
    );

    // 3. Add to receiver
    await conn.query(
      'UPDATE bank_account SET balance = balance + ? WHERE account_number = ?',
      [amount, sendTo]
    );

    // 4. Record the transaction
    await conn.query(
      `INSERT INTO sendtoown (send_from, send_to, amount, notes, transaction_timestamp)
       VALUES (
         (SELECT account_id FROM bank_account WHERE account_number = ?),
         (SELECT account_id FROM bank_account WHERE account_number = ?),
         ?, ?, NOW()
       )`,
      [sendFrom, sendTo, amount, notes]
    );

    await conn.commit();
    res.json({ success: true, message: 'Transaction successful' });
  } catch (err) {
    await conn.rollback();
    console.error('❌ Error sending money:', err);
    res.status(400).json({ success: false, message: err.message || 'Transaction failed' });
  } finally {
    conn.release();
  }
});

// POST /transfer-own
router.post('/transfer-own', async (req, res) => {
  const {
    user_id,
    from_account_id,
    from_account_number,
    from_account_label,
    to_account_number,
    amount,
    notes
  } = req.body;

  if (!user_id || !from_account_id || !from_account_number || !to_account_number || !amount) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  let connection;
  try {
    connection = await db.getConnection(); // <-- FIXED HERE
    await connection.beginTransaction();

    // 1. Get source account and check balance
    const [fromRows] = await connection.query(
      'SELECT account_id, balance, available_balance FROM bank_account WHERE account_id = ?',
      [from_account_id]
    );
    if (fromRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Source account not found' });
    }
    const fromAccount = fromRows[0];
    const transferAmount = parseFloat(amount);

    if (parseFloat(fromAccount.available_balance) < transferAmount) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    // 2. Get destination account
    const [toRows] = await connection.query(
      'SELECT account_id, balance, available_balance FROM bank_account WHERE account_number = ? AND user_id = ?',
      [to_account_number, user_id]
    );
    if (toRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Destination account not found' });
    }
    const toAccount = toRows[0];

    // 3. Generate reference code
    const referenceCode = 'PC-' + uuidv4().substring(0, 8).toUpperCase();

    // 4. Insert transfer record
    await connection.query(
      `INSERT INTO send_to_own (
        user_id,
        from_account_id,
        to_account_id,
        amount,
        notes,
        reference_code,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        user_id,
        fromAccount.account_id,
        toAccount.account_id,
        transferAmount,
        notes || null,
        referenceCode
      ]
    );

    // 5. Update balances
    const newFromBalance = parseFloat(fromAccount.balance) - transferAmount;
    const newFromAvailable = parseFloat(fromAccount.available_balance) - transferAmount;
    const newToBalance = parseFloat(toAccount.balance) + transferAmount;
    const newToAvailable = parseFloat(toAccount.available_balance) + transferAmount;

    await connection.query(
      'UPDATE bank_account SET balance = ?, available_balance = ? WHERE account_id = ?',
      [newFromBalance, newFromAvailable, fromAccount.account_id]
    );
    await connection.query(
      'UPDATE bank_account SET balance = ?, available_balance = ? WHERE account_id = ?',
      [newToBalance, newToAvailable, toAccount.account_id]
    );

    await connection.commit();

    res.status(200).json({
      success: true,
      message: 'Transfer successful',
      reference: referenceCode
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Transfer error:', error);
    res.status(500).json({ success: false, message: 'Failed to process transfer' });
  } finally {
    if (connection) connection.release();
  }
});

// POST /transfer-any
router.post('/transfer-any', async (req, res) => {
  const {
    user_id,
    from_account_id,
    from_account_number,
    from_account_label,
    to_account_id,
    to_account_number,
    to_account_label,
    amount,
    notes
  } = req.body;

  if (!user_id || !from_account_id || !from_account_number || !to_account_id || !to_account_number || !amount) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // 1. Get source account and check balance
    const [fromRows] = await connection.query(
      'SELECT account_id, balance, available_balance FROM bank_account WHERE account_id = ?',
      [from_account_id]
    );
    if (fromRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Source account not found' });
    }
    const fromAccount = fromRows[0];
    const transferAmount = parseFloat(amount);

    if (parseFloat(fromAccount.available_balance) < transferAmount) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    // 2. Get destination account
    const [toRows] = await connection.query(
      'SELECT account_id, balance, available_balance FROM bank_account WHERE account_id = ?',
      [to_account_id]
    );
    if (toRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Destination account not found' });
    }
    const toAccount = toRows[0];

    // 3. Generate reference code
    const referenceCode = 'TR-' + uuidv4().substring(0, 8).toUpperCase();

    // 4. Insert transfer record
    await connection.query(
      `INSERT INTO send_to_any (
        user_id,
        from_account_id,
        to_account_id,
        from_account_number,
        to_account_number,
        amount,
        note,
        reference_code,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        user_id,
        fromAccount.account_id,
        toAccount.account_id,
        from_account_number,
        to_account_number,
        transferAmount,
        notes || null,
        referenceCode
      ]
    );

    // 5. Update balances
    const newFromBalance = parseFloat(fromAccount.balance) - transferAmount;
    const newFromAvailable = parseFloat(fromAccount.available_balance) - transferAmount;
    const newToBalance = parseFloat(toAccount.balance) + transferAmount;
    const newToAvailable = parseFloat(toAccount.available_balance) + transferAmount;

    await connection.query(
      'UPDATE bank_account SET balance = ?, available_balance = ? WHERE account_id = ?',
      [newFromBalance, newFromAvailable, fromAccount.account_id]
    );
    await connection.query(
      'UPDATE bank_account SET balance = ?, available_balance = ? WHERE account_id = ?',
      [newToBalance, newToAvailable, toAccount.account_id]
    );

    await connection.commit();

    res.status(200).json({
      success: true,
      message: 'Transfer successful',
      reference: referenceCode
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Transfer error:', error);
    res.status(500).json({ success: false, message: 'Failed to process transfer' });
  } finally {
    if (connection) connection.release();
  }
});

// Example Express route
router.get('/bank-account-by-number/:accountNumber', async (req, res) => {
  const { accountNumber } = req.params;
  const [rows] = await db.query(
    'SELECT account_id, account_label FROM bank_account WHERE account_number = ?',
    [accountNumber]
  );
  if (rows.length) {
    res.json({ success: true, account: rows[0] });
  } else {
    res.json({ success: false });
  }
});

module.exports = router;