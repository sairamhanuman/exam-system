require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const db = require("./config/db");
const path = require("path");
const app = express();


// DEBUG route to check MySQL env variables
app.get("/env", (req, res) => {
  res.json({
    MYSQLHOST: process.env.MYSQLHOST,
    MYSQLUSER: process.env.MYSQLUSER,
    MYSQLPASSWORD_EXISTS: !!process.env.MYSQLPASSWORD,
    MYSQLDATABASE: process.env.MYSQLDATABASE,
    MYSQLPORT: process.env.MYSQLPORT
  });
});

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(express.static(path.join(__dirname, "public")));

// test route
app.get("/", (req, res) => {
  res.send("✅ Exam System Backend Running");
});

// routes
app.use("/api/programme", require("./routes/programme"));
app.use("/api/branch", require("./routes/branch"));
app.use("/api/semester", require("./routes/semester"));
app.use("/api/regulation", require("./routes/regulation"));
app.use("/api/batch", require("./routes/batch"));
app.use("/api/section", require("./routes/section"));
app.use("/api/students", require("./routes/studentmanagement"));
app.use("/api/staff", require("./routes/staff"));

// server
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// server
const PORT = process.env.PORT || 3000;

// Bind to 0.0.0.0 so Railway can expose it
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});

