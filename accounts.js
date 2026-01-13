const pool = require("../config");

// check for account existence
const checkAccExists = async (accountNumber) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM bank_account WHERE account_number = ?",
      [accountNumber],
      (err, results) => {
        if (err) {
          console.error("Error checking account:", err);
          return reject(err);
        }
        console.log("Account check results:", results);
        resolve(results.length > 0);
      }
    );
  });
};

// check for email existence
const checkEmailExist = async (email) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM user_profile WHERE email = ?",
      [email],
      (err, results) => {
        if (err) {
          console.error("Error checking email:", err);
          return reject(err);
        }
        console.log("Email check results:", results);
        resolve(results.length > 0);
      }
    );
  });
};
// const createAcc = async (accountNumber, email, mobile, dob, agree) => {
//   return new Promise((resolve, reject) => {
//     console.log("🚀 Creating account with:", {
//       accountNumber, // still included in the log for context
//       email,
//       mobile,
//       dob,
//       agree,
//     });

//     pool.getConnection((err, connection) => {
//       if (err) {
//         console.error("❌ MySQL connection error:", err);
//         return reject(err);
//       }

//       connection.beginTransaction((err) => {
//         if (err) {
//           console.error("❌ Error starting transaction:", err);
//           connection.release();
//           return reject(err);
//         }

//         // Only insert into `user_profile`
//         connection.query(
//           "INSERT INTO user_profile (mobile_number, date_of_birth, terms_accepted) VALUES ( ?, ?, ?)",
//           [email, mobile, dob, agree],
//           (err, results) => {
//             if (err) {
//               console.error("❌ MySQL insert error into user_profile:", err);
//               connection.rollback(() => {
//                 connection.release();
//               });
//               return reject(err);
//             }

//             connection.commit((err) => {
//               if (err) {
//                 console.error("❌ Error committing transaction:", err);
//                 connection.rollback(() => {
//                   connection.release();
//                 });
//                 return reject(err);
//               }

//               console.log(
//                 "✅ Insert success into user_profile:",
//                 results.insertId
//               );
//               connection.release();
//               resolve(results.insertId);
//             });
//           }
//         );
//       });
//     });
//   });
// };

module.exports = {
  checkAccExists,
  // createAcc,
  checkEmailExist,
};
