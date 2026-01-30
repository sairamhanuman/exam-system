const mysql = require("mysql2");

// Convert env variables and check them
const MYSQL_HOST = process.env.MYSQLHOST;
const MYSQL_USER = process.env.MYSQLUSER;
const MYSQL_PASSWORD = process.env.MYSQLPASSWORD;
const MYSQL_DATABASE = process.env.MYSQLDATABASE;
const MYSQL_PORT = Number(process.env.MYSQLPORT) || 3306; // default to 3306 if not set
console.log("All env vars:", process.env);

// Debug environment variables
console.log("====== MYSQL DEBUG ======");
console.log("HOST:", MYSQL_HOST);
console.log("USER:", MYSQL_USER);
console.log("DB:", MYSQL_DATABASE);
console.log("PORT:", MYSQL_PORT);
console.log("PASSWORD EXISTS:", !!MYSQL_PASSWORD);
console.log("=========================");

// Create MySQL pool
const pool = mysql.createPool({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  port: MYSQL_PORT,
  ssl: false
});

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MYSQL ERROR MESSAGE:");
    console.error(err.message);
    console.error("❌ FULL ERROR:");
    console.error(err);
  } else {
    console.log("✅ MYSQL CONNECTED SUCCESSFULLY");
    connection.release(); // release back to pool
    console.log("🔄 Connection released back to pool");
  }
});

module.exports = pool; // export pool for reuse in other files
