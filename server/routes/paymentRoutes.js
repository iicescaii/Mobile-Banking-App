const express = require('express');
const router = express.Router();
const pool = require('../config');
const { v4: uuidv4 } = require('uuid');
const bankAccountModel = require('../model/bankAccountModel');

// Route to process bill payments
router.post('/pay-bills', async (req, res) => {
  const {
    user_id,
    pay_from_account_id,
    subscriber_account_number,
    subscriber_account_name,
    amount,
    notes,
    biller_id
  } = req.body;

  // Validate required fields
  if (!user_id || !pay_from_account_id || !subscriber_account_number || 
      !subscriber_account_name || !amount || !biller_id) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }

  let connection;
  try {
    // Get a new connection from the pool
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Check account balance first
    const [accountRows] = await connection.query(
      'SELECT balance, available_balance FROM bank_account WHERE account_id = ?',
      [pay_from_account_id]
    );

    if (accountRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    const account = accountRows[0];
    const currentBalance = parseFloat(account.available_balance);
    const paymentAmount = parseFloat(amount);

    if (currentBalance < paymentAmount) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Generate a unique reference code
    const referenceCode = 'REF-' + uuidv4().substring(0, 8).toUpperCase();

    // Insert the payment record
    const [result] = await connection.query(
      `INSERT INTO payments (
        user_id,
        pay_from_account_id,
        subscriber_account_number,
        subscriber_account_name,
        amount,
        notes,
        biller_id,
        reference_code,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        user_id,
        pay_from_account_id,
        subscriber_account_number,
        subscriber_account_name,
        paymentAmount,
        notes || null,
        biller_id,
        referenceCode
      ]
    );

    // Calculate new balances
    const newBalance = parseFloat(account.balance) - paymentAmount;
    const newAvailableBalance = parseFloat(account.available_balance) - paymentAmount;

    // Update both balances using the model functions with the transaction connection
    const updateBalanceResult = await bankAccountModel.updateBalance(connection, pay_from_account_id, newBalance);
    console.log('updateBalanceResult:', updateBalanceResult);

    const updateAvailableBalanceResult = await bankAccountModel.updateAvailableBalance(connection, pay_from_account_id, newAvailableBalance);
    console.log('updateAvailableBalanceResult:', updateAvailableBalanceResult);

    // Ensure both updates affected exactly one row
    if (updateBalanceResult.affectedRows !== 1 || updateAvailableBalanceResult.affectedRows !== 1) {
      await connection.rollback();
      return res.status(500).json({
        success: false,
        message: 'Failed to update account balances'
      });
    }

    // Commit the transaction
    await connection.commit();

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      reference_code: referenceCode,
      payment_id: result.insertId
    });

  } catch (error) {
    // Rollback transaction on error
    if (connection) {
      await connection.rollback();
    }
    console.error('Payment processing error:', error);
    
    // Check for specific error types
    if (error.code === 'ER_LOCK_DEADLOCK') {
      return res.status(409).json({
        success: false,
        message: 'Transaction conflict. Please try again.'
      });
    }
    
    if (error.code === 'ER_LOCK_WAIT_TIMEOUT') {
      return res.status(408).json({
        success: false,
        message: 'Transaction timeout. Please try again.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to process payment'
    });
  } finally {
    // Always release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;