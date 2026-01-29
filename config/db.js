const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
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
