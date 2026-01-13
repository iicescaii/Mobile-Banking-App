require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2/promise");
const loginRoutes = require("./routes/loginRoutes");
const otpRoutes = require("./routes/otpRoutes");
const deviceRoutes = require("./routes/deviceRoutes"); // ✅ NEW
const secureRoutes = require('./routes/secureRoutes'); // ✅ import it
const billerRoutes = require('./routes/billerRoutes'); 
const accountRoutes = require('./routes/accountRoutes');
const accountDetails = require('./routes/accountDetails');
const paymentRoutes = require('./routes/paymentRoutes');
const favoriteBillerRoutes = require('./routes/favoriteBillerRoutes');
const favoriteReceiverRoutes = require('./routes/favoriteReceiverRoutes');

const bankRoutes = require('./routes/bankRoutes');
const bankAccountRoutes = require('./routes/bankaccountRoute');
const cardRoutes = require('./routes/cardRoutes');
const cardDetailsRoutes = require('./routes/cardDetailsRoutes');
const cardLimitsRoutes = require('./routes/cardLimitsRoutes');
const timeDeposit = require('./routes/timeDeposit');
const transacRoutes = require('./routes/transacRoutes');
const pinRoutes = require('./routes/pinRoutes');  
const transferRoutes = require('./routes/transferRoutes');

const app = express();
const port = process.env.PORT || 5000;

// MySQL connection pool setup using promises
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Zenbankaccount@1",
  database: process.env.DB_NAME || "zenbank_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export pool for use in models
module.exports = pool;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use((req, _, next) => {
  console.log("Received data:", typeof req.body);
  next();
});

// Test MySQL connection using async/await
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to MySQL (ZenBank Database)");
    connection.release();
  } catch (err) {
    console.error("Failed to connect to MySQL:", err.message);
    process.exit(1);
  }
}

testConnection();

// Routes
app.use('/api', loginRoutes);
app.use('/api', otpRoutes);
app.use('/api', deviceRoutes);
app.use('/api', secureRoutes);
app.use('/api', billerRoutes);
app.use('/api', accountRoutes);  
app.use('/api', paymentRoutes); 
app.use('/api', favoriteBillerRoutes);
app.use('/api', favoriteReceiverRoutes);


app.use('/api', bankRoutes);
app.use('/api', cardRoutes);
app.use('/api', bankAccountRoutes);
app.use('/api/card-limits', cardLimitsRoutes);
app.use('/api/card-details', cardDetailsRoutes);
app.use('/api/time-deposits', timeDeposit);
app.use('/api', pinRoutes);
app.use('/api', transferRoutes);
app.use('/api', transacRoutes);


// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
