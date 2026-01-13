const express = require('express');
const router = express.Router();
const pool = require('../config');
const accountsModel = require('../model/accountsModel');
const { verifyTokenMiddleware } = require('../middleware/authMiddleware');

// GET all active bank accounts for the current user
router.get('/bank-accounts', verifyTokenMiddleware, async (req, res) => {
  try {
    const user_id = req.user.user_id; // user_id from decoded JWT
    const accounts = await accountsModel.getAccountsByUserId(user_id);
    res.status(200).json({
      success: true,
      accounts,
      count: accounts.length
    });
  } catch (err) {
    console.error('Error in GET /accounts:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching accounts'
    });
  }
});

// GET all active accounts with user details
router.get('/accounts', verifyTokenMiddleware, async (req, res) => {
  try {
    const query = `
      SELECT 
        a.account_number,
        a.account_label,
        a.account_type,
        a.status,
        u.first_name,
        u.last_name
      FROM bank_account a
      JOIN user_profile u ON a.user_id = u.user_id
      WHERE a.status = 'Active'
    `;
    const [results] = await pool.query(query);
    res.json({ success: true, accounts: results });
  } catch (err) {
    console.error('Error fetching accounts:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve accounts' });
  }
});

// GET user and their accounts by userId
router.get('/users/:userId', verifyTokenMiddleware, async (req, res) => {
  const userId = req.params.userId;
  try {
    const query = `
      SELECT 
        u.user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.mobile_number,
        u.date_of_birth,
        u.zenbank_verified,
        u.created_at,
        u.terms_accepted,
        b.account_id,
        b.account_number,
        b.card_number,
        b.account_type,
        b.balance,
        b.available_balance,
        b.account_label,
        b.interest_rate,
        b.status AS account_status,
        b.created_at AS account_created_at,
        b.last_transaction_at
      FROM user_profile u
      LEFT JOIN bank_account b ON u.user_id = b.user_id
      WHERE u.user_id = ?
    `;
    const [results] = await pool.query(query, [userId]);
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const userInfo = {
      user_id: results[0].user_id,
      first_name: results[0].first_name,
      last_name: results[0].last_name,
      email: results[0].email,
      mobile_number: results[0].mobile_number,
      date_of_birth: results[0].date_of_birth,
      zenbank_verified: results[0].zenbank_verified,
      created_at: results[0].created_at,
      terms_accepted: results[0].terms_accepted,
      accounts: results
        .filter(row => row.account_id !== null)
        .map(row => ({
          account_id: row.account_id,
          account_number: row.account_number,
          card_number: row.card_number,
          account_type: row.account_type,
          balance: row.balance,
          available_balance: row.available_balance,
          account_label: row.account_label,
          interest_rate: row.interest_rate,
          status: row.account_status,
          created_at: row.account_created_at,
          last_transaction_at: row.last_transaction_at
        }))
    };
    res.json({ success: true, user: userInfo });
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve user data' });
  }
});

// Update user email
router.put('/users/:userId/email', verifyTokenMiddleware, async (req, res) => {
  const userId = req.params.userId;
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }
  try {
    const query = `UPDATE user_profile SET email = ? WHERE user_id = ?`;
    const [result] = await pool.query(query, [email, userId]);
    res.json({ success: true, message: 'Email updated successfully' });
  } catch (err) {
    console.error('Error updating email:', err);
    res.status(500).json({ success: false, message: 'Failed to update email' });
  }
});

// Update user phone number
router.put('/users/:userId/phone', verifyTokenMiddleware, async (req, res) => {
  const userId = req.params.userId;
  const { phone_number } = req.body;
  if (!phone_number) {
    return res.status(400).json({ success: false, message: 'Phone number is required' });
  }
  try {
    const query = `UPDATE user_profile SET mobile_number = ? WHERE user_id = ?`;
    const [result] = await pool.query(query, [phone_number, userId]);
    res.json({ success: true, message: 'Phone number updated successfully' });
  } catch (err) {
    console.error('Error updating phone number:', err);
    res.status(500).json({ success: false, message: 'Failed to update phone number' });
  }
});

module.exports = router;