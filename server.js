app.get("/", (req, res) => {
  res.send("Exam System Backend is running 🚀");
});


require("dotenv").config();
console.log("ENV CHECK:", process.env.MYSQL_USER);

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

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


const studentManagementRoutes =
  require("./routes/studentmanagement");
app.use("/api/students", studentManagementRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
