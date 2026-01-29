const mysql = require("mysql2");

// Create MySQL connection pool
const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection on startup (recommended)
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL connection failed:");
    console.error(err.message);
  } else {
    console.log("✅ MySQL connected successfully");
    connection.release();
  }
});

module.exports = db;
