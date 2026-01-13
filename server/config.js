require("dotenv").config();
const mysql = require("mysql2/promise");

// Create a MySQL connection pool using environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost", // MySQL host
  user: process.env.DB_USER || "root", // MySQL username
  password: process.env.DB_PASSWORD || "Zenbankaccount@1", // MySQL password
  database: process.env.DB_NAME || "zenbank_db", // Database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test the connection
pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  });

module.exports = pool; // Export the pool to be used in other files
