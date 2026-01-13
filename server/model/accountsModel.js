const pool = require('../config'); // Adjust path if needed

const getAccountsByUserId = async (user_id) => {
  try {
    const [results] = await pool.query(
      "SELECT * FROM bank_account WHERE user_id = ? AND status = 'Active'",
      [user_id]
    );
    return results;
  } catch (error) {
    console.error('Database error in getAccountsByUserId:', error);
    throw new Error('Failed to fetch accounts');
  }
};

module.exports = {
  getAccountsByUserId,
};