require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const db = require("./config/db");
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// DEBUG route
app.get("/env", (req, res) => {
  res.json({
    MYSQLHOST: process.env.MYSQLHOST,
    MYSQLUSER: process.env.MYSQLUSER,
    MYSQLPASSWORD_EXISTS: !!process.env.MYSQLPASSWORD,
    MYSQLDATABASE: process.env.MYSQLDATABASE,
    MYSQLPORT: process.env.MYSQLPORT
  });
});

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
app.use("/api/course", require("./routes/course"));

// uploads
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use("/api/course-mapping", require("./routes/courseMapping"));


// server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});
