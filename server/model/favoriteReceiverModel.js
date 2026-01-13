const db = require('../config');

// Helper function to generate a random 5-digit favorite_receiver_id
function generateRandomFavoriteReceiverId() {
  return Math.floor(10000 + Math.random() * 90000); // 5-digit number
}

// Helper function to ensure the favorite_receiver_id is unique in the database
async function getUniqueFavoriteReceiverId() {
  let unique = false;
  let favorite_receiver_id;
  while (!unique) {
    favorite_receiver_id = generateRandomFavoriteReceiverId();
    const [rows] = await db.query(
      'SELECT 1 FROM favorite_receivers WHERE favorite_receiver_id = ?',
      [favorite_receiver_id]
    );
    if (rows.length === 0) unique = true;
  }
  return favorite_receiver_id;
}

// Add a favorite receiver
const insertFavoriteReceiver = async ({ user_id, receiver_account_id, receiver_name, receiver_account_number, favorite_nickname, amount }) => {
  const favorite_receiver_id = await getUniqueFavoriteReceiverId();
  const sql = 'INSERT INTO favorite_receivers (favorite_receiver_id, user_id, receiver_account_id, receiver_name, receiver_account_number, favorite_nickname, amount) VALUES (?, ?, ?, ?, ?, ?, ?)';
  try {
    const [result] = await db.query(sql, [favorite_receiver_id, user_id, receiver_account_id, receiver_name, receiver_account_number, favorite_nickname, amount]);
    return result;
  } catch (err) {
    throw err;
  }
};

// Get all favorite receivers for a user
const getFavoriteReceiversByUserId = async (user_id) => {
  const sql = 'SELECT * FROM favorite_receivers WHERE user_id = ?';
  try {
    const [results] = await db.query(sql, [user_id]);
    return results;
  } catch (err) {
    throw err;
  }
};

// Update a favorite receiver
const updateFavoriteReceiver = async (favorite_receiver_id, { receiver_account_id, receiver_name, receiver_account_number, favorite_nickname, amount }) => {
  const sql = 'UPDATE favorite_receivers SET receiver_account_id = ?, receiver_name = ?, receiver_account_number = ?, favorite_nickname = ?, amount = ? WHERE favorite_receiver_id = ?';
  try {
    const [result] = await db.query(sql, [receiver_account_id, receiver_name, receiver_account_number, favorite_nickname, amount, favorite_receiver_id]);
    return result;
  } catch (err) {
    throw err;
  }
};

// Delete a favorite receiver
const deleteFavoriteReceiver = async (favorite_receiver_id) => {
  const sql = 'DELETE FROM favorite_receivers WHERE favorite_receiver_id = ?';
  try {
    const [result] = await db.query(sql, [favorite_receiver_id]);
    return result;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  insertFavoriteReceiver,
  getFavoriteReceiversByUserId,
  updateFavoriteReceiver,
  deleteFavoriteReceiver,
};