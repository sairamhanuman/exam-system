const mysql = require("mysql2");

console.log("====== MYSQL DEBUG ======");
console.log("HOST:", process.env.MYSQL_HOST);
console.log("USER:", process.env.MYSQL_USER);
console.log("DB:", process.env.MYSQL_DATABASE);
console.log("PORT:", process.env.MYSQL_PORT);
console.log("PASSWORD EXISTS:", !!process.env.MYSQL_PASSWORD);
console.log("=========================");

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,          // mysql.railway.internal
  user: process.env.MYSQL_USER,          // root
  password: process.env.MYSQL_PASSWORD,  // auto generated
  database: process.env.MYSQL_DATABASE,  // railway
  port: process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MYSQL CONNECTION ERROR:");
    console.error(err);
  } else {
    console.log("✅ MYSQL CONNECTED SUCCESSFULLY");
    connection.release();
  }
});

module.exports = pool;
