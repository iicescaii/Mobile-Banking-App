const pool = require('../config'); // Assuming you are using a connection pool

const getBillers = async () => {
  try {
    console.log('Executing getBillers query...');
    const [results] = await pool.query('SELECT * FROM billers WHERE is_active = 1');
    console.log('Query results:', results);
    return results;
  } catch (err) {
    console.error('Database error in getBillers:', err);
    throw err;
  }
};

// Fetch biller by name to get the biller_id
const getBillerByName = async (biller_name) => {
  try {
    const [results] = await pool.query(
      'SELECT billers_id, biller_name FROM billers WHERE biller_name = ? AND is_active = 1',
      [biller_name]
    );
    if (results.length === 0) {
      return null;
    } else {
      return results[0];
    }
  } catch (err) {
    throw err;
  }
};

// Add a new biller (used in /add route)
const addBiller = async ({ biller_name, category, is_active }) => {
  try {
    const sql = 'INSERT INTO billers (biller_name, category, is_active) VALUES (?, ?, ?)';
    const [results] = await pool.query(sql, [biller_name, category, is_active]);
    return { billers_id: results.insertId, biller_name, category, is_active };
  } catch (err) {
    throw err;
  }
};

module.exports = { getBillers, getBillerByName, addBiller };