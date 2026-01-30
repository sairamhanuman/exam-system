const express = require("express");
const router = express.Router();
const db = require("../config/db");
const ExcelJS = require("exceljs");
const multer = require("multer");
const path = require("path");

/* ==================================================
   DROPDOWN FILTERS
================================================== */
router.get("/filters", async (req, res) => {
  try {
    const result = {};

    const [batch] = await db.query("SELECT * FROM batch_master WHERE status=1");
    result.batch = batch;

    const [programme] = await db.query("SELECT * FROM programme_master WHERE status=1");
    result.programme = programme;

    const [branch] = await db.query("SELECT * FROM branch_master WHERE status=1");
    result.branch = branch;

    const [semester] = await db.query("SELECT * FROM semester_master WHERE status=1");
    result.semester = semester;

    const [regulation] = await db.query("SELECT * FROM regulation_master WHERE status=1");
    result.regulation = regulation;

    const [section] = await db.query("SELECT * FROM section_master WHERE status=1");
    result.section = section;

    res.json(result);
  } catch (err) {
    console.error(err);
    res.json({});
  }
});

/* ==================================================
   GENERATE EXCEL TEMPLATE
================================================== */
router.post("/generate-excel", async (req, res) => {
  try {
    const { batch, programme, branch, semester, regulation } = req.body;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Students");

    sheet.addRow(["Batch", batch]);
    sheet.addRow(["Programme", programme]);
    sheet.addRow(["Branch", branch]);
    sheet.addRow(["Semester", semester]);
    sheet.addRow(["Regulation", regulation]);
    sheet.addRow([]);
    sheet.addRow([
      "Ht.No",
      "Student Name",
      "Father Name",
      "Mother Name",
      "Age",
      "Sex (0=Male 1=Female)",
      "DOB (DD/MM/YYYY)",
      "Aadhar No",
      "Student Mobile",
      "Parent Mobile",
      "DOJ (DD/MM/YYYY)",
      "Section"
    ]);

    sheet.getRow(7).font = { bold: true };

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=StudentTemplate.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ==================================================
   EXCEL UPLOAD CONFIG
================================================== */
const excelUpload = multer({ storage: multer.memoryStorage() });

/* ==================================================
   DATE CONVERSION
================================================== */
function excelDateToJS(v) {
  if (!v) return null;
  if (v instanceof Date) return v;
  if (typeof v === "number") return new Date(Math.round((v - 25569) * 86400 * 1000));
  if (typeof v === "string") {
    const p = v.split("/");
    if (p.length === 3) return new Date(`${p[2]}-${p[1]}-${p[0]}`);
  }
  return null;
}

/* ==================================================
   UPLOAD EXCEL
================================================== */
router.post("/upload-excel", excelUpload.single("file"), async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const sheet = workbook.getWorksheet(1);
    const students = [];

    sheet.eachRow((row, i) => {
      if (i <= 7) return; // skip header rows
      const v = row.values;
      if (!v[1]) return;

      students.push([
        req.body.batch,
        req.body.programme,
        req.body.branch,
        req.body.semester,
        req.body.regulation,
        v[1], // htno
        v[2], // student_name
        v[3], // father_name
        v[4], // mother_name
        v[5], // age
        v[6], // sex
        excelDateToJS(v[7]), // dob
        v[8], // aadhar_no
        v[9], // student_mobile
        v[10], // parent_mobile
        excelDateToJS(v[11]), // doj
        v[12], // section
        "On Roll"
      ]);
    });

    const sql = `
      INSERT IGNORE INTO students
      (batch, programme, branch, semester, regulation,
       htno, student_name, father_name, mother_name, age,
       sex, dob, aadhar_no, student_mobile, parent_mobile,
       doj, section, status)
      VALUES ?
    `;

    await db.query(sql, [students]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
});

/* ==================================================
   LEFT PANEL LIST (SLNO + HTNO)
================================================== */
router.get("/list", async (req, res) => {
  try {
    const { batch, programme, branch, semester, regulation, status } = req.query;

    let sql = `
      SELECT id AS slno, htno
      FROM students
      WHERE batch=? AND programme=? AND branch=? AND semester=? AND regulation=?
    `;
    const params = [batch, programme, branch, semester, regulation];

    if (status && status !== "") {
      sql += " AND status=?";
      params.push(status);
    }
    sql += " ORDER BY htno";

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.json([]);
  }
});

/* ==================================================
   STUDENT DETAILS
================================================== */
router.get("/details/:htno", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM students WHERE htno=?", [req.params.htno]);
    res.json(rows[0] || null);
  } catch (err) {
    console.error(err);
    res.json(null);
  }
});

/* ==================================================
   UPDATE STUDENT DETAILS
================================================== */
router.put("/update/:htno", async (req, res) => {
  try {
    const d = req.body;
    const sql = `
      UPDATE students SET
        admno=?, student_name=?, father_name=?, mother_name=?,
        sex=?, dob=?, age=?, aadhar_no=?,
        student_mobile=?, parent_mobile=?, doj=?, section=?, status=?
      WHERE htno=?
    `;
    await db.query(sql, [
      d.admno,
      d.student_name,
      d.father_name,
      d.mother_name,
      d.sex,
      d.dob,
      d.age,
      d.aadhar_no,
      d.student_mobile,
      d.parent_mobile,
      d.doj,
      d.section,
      d.status,
      req.params.htno
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
});

/* ==================================================
   PHOTO UPLOAD CONFIG
================================================== */
const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/students"),
  filename: (req, file, cb) => cb(null, file.originalname) // must be HTNO.jpg
});

const bulkUpload = multer({ storage: photoStorage });
const singleUpload = multer({ storage: photoStorage });

/* ==================================================
   BULK PHOTO UPLOAD
================================================== */
router.post("/upload-photos", bulkUpload.array("photos"), async (req, res) => {
  try {
    let count = 0;
    for (const file of req.files) {
      const htno = path.parse(file.originalname).name;
      const photoPath = "uploads/students/" + file.filename;
      await db.query("UPDATE students SET photo=? WHERE htno=?", [photoPath, htno]);
      count++;
    }
    res.json({ success: true, uploaded: count });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
});

/* ==================================================
   SINGLE PHOTO UPLOAD
================================================== */
router.post("/upload-photo/:htno", singleUpload.single("photo"), async (req, res) => {
  try {
    const photoPath = "uploads/students/" + req.file.filename;
    await db.query("UPDATE students SET photo=? WHERE htno=?", [photoPath, req.params.htno]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;
