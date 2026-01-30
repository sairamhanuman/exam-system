  const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  ssl: false
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MYSQL ERROR MESSAGE:");
    console.error(err.message);
    console.error("❌ FULL ERROR:");
    console.error(err);
  } else {
    console.log("✅ MYSQL CONNECTED SUCCESSFULLY");
    connection.release();
  }
});
