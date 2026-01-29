
console.log("MYSQLHOST:", process.env.MYSQLHOST);
console.log("MYSQLUSER:", process.env.MYSQLUSER);
console.log("MYSQLDATABASE:", process.env.MYSQLDATABASE);
console.log("MYSQLPORT:", process.env.MYSQLPORT);
// Load modules
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Root route
app.get("/", (req, res) => {
  res.send("Exam System Backend is running 🚀");
});

// ✅ MySQL connection (RAILWAY SAFE)
const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ Test DB connection on startup
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL database!");
    connection.release();
  }
});

// Make `db` available in routes
app.locals.db = db;

// Routes
try {
  app.use("/api/programme", require("./routes/programme"));
  app.use("/api/branch", require("./routes/branch"));
  app.use("/api/semester", require("./routes/semester"));
  app.use("/api/regulation", require("./routes/regulation"));
  app.use("/api/batch", require("./routes/batch"));
  app.use("/api/section", require("./routes/section"));
  app.use("/api/students", require("./routes/studentmanagement"));
} catch (err) {
  console.warn("⚠️ Route loading issue:", err.message);
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
