// server.js
require("dotenv").config(); // Load environment variables first

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const db = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Attach db pool to app locals (optional)
app.locals.db = db;

// Root route
app.get("/", (req, res) => {
  res.send("Exam System Backend is running 🚀");
});

// Routes
app.use("/api/programme", require("./routes/programme"));
app.use("/api/branch", require("./routes/branch"));
app.use("/api/semester", require("./routes/semester"));
app.use("/api/regulation", require("./routes/regulation"));
app.use("/api/batch", require("./routes/batch"));
app.use("/api/section", require("./routes/section"));
app.use("/api/students", require("./routes/studentmanagement"));

// Port (Railway safe)
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
