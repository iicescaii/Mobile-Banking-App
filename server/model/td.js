const pool = require("../config");

// Fetch all time deposits by user_id
const getDepositsByAccount = (user_id) => {
  return new Promise((resolve, reject) => {
    if (!user_id) {
      return reject(new Error("User ID is required"));
    }
    pool.query(
      "SELECT * FROM time_deposits WHERE user_id = ?",
      [user_id],
      (err, results) => {
        if (err) {
          console.error("❌ SQL Error:", err);
          return reject(err);
        }
        resolve(results);
      }
    );
  });
};

// Insert new time deposit
const createDeposit = (user_id, investmentAmount, investmentDuration, interest, nickname) => {
  return new Promise((resolve, reject) => {
    if (!user_id) {
      return reject(new Error("User ID is required"));
    }
    pool.query(
      "INSERT INTO time_deposits (user_id, investment_amount, investment_duration, interest, nickname) VALUES (?, ?, ?, ?, ?)",
      [user_id, investmentAmount, investmentDuration, interest, nickname],
      (err, results) => {
        if (err) {
          console.error("❌ MySQL insert error:", err);
          return reject(err);
        }
        resolve(results.insertId);
      }
    );
  });
};

const updateNickname = (depositId, nickname) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE time_deposits SET nickname = ? WHERE id = ?",
      [nickname, depositId],
      (err, results) => {
        if (err) {
          console.error("SQL Error:", err);
          return reject(err);
        }
        resolve(results);
      }
    );
  });
};

module.exports = {
  getDepositsByAccount,
  createDeposit,
  updateNickname, 
};
