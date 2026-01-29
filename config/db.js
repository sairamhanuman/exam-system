// config/db.js
const mysql = require("mysql2");

// Create a pool using Railway environment variables
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Retry connection in case MySQL isn't ready yet
function connectWithRetry(retries = 10) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("❌ MySQL connection failed:", err.message);
      if (retries > 0) {
        console.log(`⏳ Retrying in 5s... (${retries} retries left)`);
        setTimeout(() => connectWithRetry(retries - 1), 5000);
      } else {
        console.error("❌ Could not connect to MySQL after multiple attempts.");
      }
    } else {
      console.log("✅ MySQL connected successfully!");
      connection.release();
    }
  });
}

// Start retry
connectWithRetry();

module.exports = pool;
