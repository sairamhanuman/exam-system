const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: "root",
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQLPORT,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;
