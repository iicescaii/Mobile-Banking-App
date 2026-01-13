// Helper function to generate a random 5-digit favorite_id
function generateRandomFavoriteId() {
  return Math.floor(10000 + Math.random() * 90000); // 5-digit number
}

// Helper function to ensure the favorite_id is unique in the database
const pool = require('../config');

async function getUniqueFavoriteId() {
  let unique = false;
  let favorite_id;
  while (!unique) {
    favorite_id = generateRandomFavoriteId();
    const [rows] = await pool.query(
      'SELECT 1 FROM favorite_billers WHERE favorite_id = ?',
      [favorite_id]
    );
    if (rows.length === 0) unique = true;
  }
  return favorite_id;
}

const insertFavorite = async (favoriteData) => {
  const {
    user_id,
    biller_id,
    biller_name,
    subscriber_account_number,
    subscriber_account_name,
    favorite_nickname
  } = favoriteData;

  // Generate a unique favorite_id
  const favorite_id = await getUniqueFavoriteId();

  const sql = `
    INSERT INTO favorite_billers 
      (favorite_id, user_id, biller_id, biller_name, subscriber_account_number, subscriber_account_name, favorite_nickname)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  try {
    const [result] = await pool.query(
      sql,
      [favorite_id, user_id, biller_id, biller_name, subscriber_account_number, subscriber_account_name, favorite_nickname]
    );
    return result;
  } catch (err) {
    throw err;
  }
};

const getFavoritesByUserId = async (user_id) => {
  const [results] = await pool.query(
    'SELECT * FROM favorite_billers WHERE user_id = ?',
    [user_id]
  );
  return results;
};

const updateFavorite = async (favorite_id, favoriteData) => {
  const sql = `
    UPDATE favorite_billers
    SET biller_name = ?, subscriber_account_number = ?, subscriber_account_name = ?, favorite_nickname = ?
    WHERE favorite_id = ?
  `;
  const { biller_name, subscriber_account_number, subscriber_account_name, favorite_nickname } = favoriteData;
  try {
    const [result] = await pool.query(
      sql,
      [biller_name, subscriber_account_number, subscriber_account_name, favorite_nickname, favorite_id]
    );
    return result;
  } catch (err) {
    throw err;
  }
};

const deleteFavorite = async (favorite_id) => {
  const sql = 'DELETE FROM favorite_billers WHERE favorite_id = ?';
  try {
    const [result] = await pool.query(sql, [favorite_id]);
    return result;
  } catch (err) {
    throw err;
  }
};

module.exports = { insertFavorite, getFavoritesByUserId, updateFavorite, deleteFavorite };