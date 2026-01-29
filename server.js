

// Load modules
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

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "exam_system",
  port: process.env.DB_PORT || 3306
});

// Connect to MySQL with error handling
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL database!");
  }
});

// Make `db` available in routes
app.locals.db = db;

// Routes
try {
  const programmeRoutes = require("./routes/programme");
  app.use("/api/programme", programmeRoutes);

  const branchRoutes = require("./routes/branch");
  app.use("/api/branch", branchRoutes);

  const semesterRoutes = require("./routes/semester");
  app.use("/api/semester", semesterRoutes);

  const regulationRoutes = require("./routes/regulation");
  app.use("/api/regulation", regulationRoutes);

  const batchRoutes = require("./routes/batch");
  app.use("/api/batch", batchRoutes);

  const sectionRoutes = require("./routes/section");
  app.use("/api/section", sectionRoutes);

  const studentManagementRoutes = require("./routes/studentmanagement");
  app.use("/api/students", studentManagementRoutes);
} catch (err) {
  console.warn("⚠️ One or more route files are missing or failed to load:", err.message);
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
