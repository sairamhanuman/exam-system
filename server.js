require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const db = require("./config/db");

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

// server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
