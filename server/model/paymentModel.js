const pool = require('../config'); // Database connection pool

const insertPayment = async (paymentData) => {
  const { 
    user_id, 
    pay_from_account_id, 
    reference_code, 
    subscriber_account_number, 
    subscriber_account_name, 
    biller_id,
    amount, 
    notes 
  } = paymentData;

  // Insert payment into the database
  try {
    const [results] = await pool.query(
      'INSERT INTO payments (user_id, pay_from_account_id, reference_code, subscriber_account_number, subscriber_account_name, biller_id, amount, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [user_id, pay_from_account_id, reference_code, subscriber_account_number, subscriber_account_name, biller_id, amount, notes]
    );
    return results;
  } catch (err) {
    throw err;
  }
};
module.exports = { insertPayment };
