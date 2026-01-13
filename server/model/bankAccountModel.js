const db = require('../config'); // Assuming you have a db.js for database connection

// Get account balance from the bank_account table
const getAccountBalance = async (user_id, account_id) => {
  const sql = 'SELECT balance, available_balance FROM bank_account WHERE user_id = ? AND account_id = ?';
  const [results] = await db.query(sql, [user_id, account_id]);
  return results;
};

// Update the account balance after payment (transaction-safe)
const updateBalance = async (connection, account_id, newBalance) => {
  const sql = 'UPDATE bank_account SET balance = ?, last_transaction_at = ? WHERE account_id = ?';
  const [results] = await connection.query(sql, [newBalance, new Date(), account_id]);
  return results;
};

// Get available balance from the bank_account table
const getAvailableBalance = async (user_id, account_id) => {
  const sql = 'SELECT available_balance FROM bank_account WHERE user_id = ? AND account_id = ?';
  const [results] = await db.query(sql, [user_id, account_id]);
  return results;
};

// Update the available balance after payment (transaction-safe)
const updateAvailableBalance = async (connection, account_id, newAvailableBalance) => {
  const sql = 'UPDATE bank_account SET available_balance = ?, last_transaction_at = ? WHERE account_id = ?';
  const [results] = await connection.query(sql, [newAvailableBalance, new Date(), account_id]);
  return results;
};

// Update the last transaction timestamp (transaction-safe)
const updateLastTransaction = async (connection, account_id, timestamp) => {
  const sql = 'UPDATE bank_account SET last_transaction_at = ? WHERE account_id = ?';
  const [results] = await connection.query(sql, [timestamp, account_id]);
  return results;
};

const getAccountIdByAccountNumber = async (account_number) => {
  const sql = 'SELECT account_id FROM bank_account WHERE account_number = ? LIMIT 1';
  const [results] = await db.query(sql, [account_number]);
  if (results.length === 0) return null;
  return results[0].account_id;
};

module.exports = {
  getAvailableBalance,
  updateAvailableBalance,
  getAccountBalance,
  updateBalance,
  updateLastTransaction,
  getAccountIdByAccountNumber
};