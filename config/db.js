const mysql = require("mysql2");

console.log("====== MYSQL DEBUG ======");
console.log("HOST:", process.env.MYSQLHOST);
console.log("USER:", process.env.MYSQLUSER);
console.log("DB:", process.env.MYSQLDATABASE);
console.log("PORT:", process.env.MYSQLPORT);
console.log("PASSWORD EXISTS:", !!process.env.MYSQLPASSWORD);
console.log("=========================");

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,          // mysql.railway.internal
  user: process.env.MYSQLUSER,          // root
  password: process.env.MYSQLPASSWORD,  // auto generated
  database: process.env.MYSQLDATABASE,  // railway
  port: process.env.MYSQLPORT,
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
