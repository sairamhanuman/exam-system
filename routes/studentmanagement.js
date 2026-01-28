const express = require("express");
const router = express.Router();
const db = require("../config/db");
const ExcelJS = require("exceljs");
const multer = require("multer");
const path = require("path");

/* ==================================================
   DROPDOWN FILTERS
================================================== */

router.get("/filters", (req, res) => {

  const result = {};

  db.query("SELECT * FROM batch_master WHERE status=1", (e, batch) => {
    result.batch = batch;

    db.query("SELECT * FROM programme_master WHERE status=1", (e, programme) => {
      result.programme = programme;

      db.query("SELECT * FROM branch_master WHERE status=1", (e, branch) => {
        result.branch = branch;

        db.query("SELECT * FROM semester_master WHERE status=1", (e, semester) => {
          result.semester = semester;

          db.query("SELECT * FROM regulation_master WHERE status=1", (e, regulation) => {
            result.regulation = regulation;

            db.query("SELECT * FROM section_master WHERE status=1", (e, section) => {
              result.section = section;
              res.json(result);
            });
          });
        });
      });
    });
  });
});

/* ==================================================
   GENERATE EXCEL TEMPLATE
================================================== */

router.post("/generate-excel", async (req, res) => {

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
});

/* ==================================================
   EXCEL UPLOAD CONFIG
================================================== */

const excelUpload = multer({
  storage: multer.memoryStorage()
});

/* ==================================================
   DATE CONVERSION
================================================== */

function excelDateToJS(v) {

  if (!v) return null;

  if (v instanceof Date) return v;

  if (typeof v === "number") {
    return new Date(Math.round((v - 25569) * 86400 * 1000));
  }

  if (typeof v === "string") {
    const p = v.split("/");
    if (p.length === 3)
      return new Date(`${p[2]}-${p[1]}-${p[0]}`);
  }

  return null;
}

/* ==================================================
   UPLOAD EXCEL
================================================== */

router.post(
  "/upload-excel",
  excelUpload.single("file"),
  async (req, res) => {

    try {

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(req.file.buffer);

      const sheet = workbook.getWorksheet(1);
      const students = [];

      sheet.eachRow((row, i) => {

        if (i <= 7) return;

        const v = row.values;
        if (!v[1]) return;

        students.push([
          req.body.batch,
          req.body.programme,
          req.body.branch,
          req.body.semester,
          req.body.regulation,

          v[1],
          v[2],
          v[3],
          v[4],
          v[5],
          v[6],
          excelDateToJS(v[7]),
          v[8],
          v[9],
          v[10],
          excelDateToJS(v[11]),
          v[12],
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

      db.query(sql, [students], err => {

        if (err)
          return res.json({ success: false, message: err.message });

        res.json({ success: true });
      });

    } catch (err) {
      res.json({ success: false, message: err.message });
    }
  }
);

/* ==================================================
   LEFT PANEL LIST (SLNO + HTNO)
================================================== */

router.get("/list", (req, res) => {

  const {
    batch,
    programme,
    branch,
    semester,
    regulation,
    status
  } = req.query;

  let sql = `
    SELECT id AS slno, htno
    FROM students
    WHERE batch=?
      AND programme=?
      AND branch=?
      AND semester=?
      AND regulation=?
  `;

  const params = [
    batch,
    programme,
    branch,
    semester,
    regulation
  ];

  // ✅ STATUS FILTER
  if (status && status !== "") {
    sql += " AND status=?";
    params.push(status);
  }

  sql += " ORDER BY htno";

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error(err);
      return res.json([]);
    }
    res.json(rows);
  });
});


/* ==================================================
   STUDENT DETAILS
================================================== */

router.get("/details/:htno", (req, res) => {

  db.query(
    "SELECT * FROM students WHERE htno=?",
    [req.params.htno],
    (err, rows) => {

      if (err || rows.length === 0)
        return res.json(null);

      res.json(rows[0]);
    }
  );
});

/* ==================================================
   UPDATE STUDENT DETAILS
================================================== */
router.put("/update/:htno", (req, res) => {

  const d = req.body;

  const sql = `
    UPDATE students SET
      admno=?,
      student_name=?,
      father_name=?,
      mother_name=?,
      sex=?,
      dob=?,
      age=?,
      aadhar_no=?,
      student_mobile=?,
      parent_mobile=?,
      doj=?,
      section=?,
      status=?
    WHERE htno=?
  `;

  db.query(
    sql,
    [
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
    ],
    err => {

      if (err) {
        console.error(err);
        return res.json({ success: false });
      }

      res.json({ success: true });
    }
  );
});

/* ==================================================
   PHOTO UPLOAD CONFIG
================================================== */

/* ============================================
   BULK PHOTO UPLOAD
============================================ */

const photoStorage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "public/uploads/students");
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname); 
    // filename must be HTNO.jpg
  }
});

const bulkUpload = multer({ storage: photoStorage });

router.post(
  "/upload-photos",
  bulkUpload.array("photos"),
  (req, res) => {

    let count = 0;

    req.files.forEach(file => {

      const htno = path.parse(file.originalname).name;

      const photoPath =
        "uploads/students/" + file.filename;

      db.query(
        "UPDATE students SET photo=? WHERE htno=?",
        [photoPath, htno]
      );

      count++;
    });

    res.json({
      success: true,
      uploaded: count
    });
  }
);
/* ============================================
   SINGLE PHOTO UPLOAD
============================================ */

const singleUpload = multer({ storage: photoStorage });

router.post(
  "/upload-photo/:htno",
  singleUpload.single("photo"),
  (req, res) => {

    const photoPath =
      "uploads/students/" + req.file.filename;

    db.query(
      "UPDATE students SET photo=? WHERE htno=?",
      [photoPath, req.params.htno],
      err => {

        if (err) {
          console.error(err);
          return res.json({ success: false });
        }

        res.json({ success: true });
      }
    );
  }
);

module.exports = router;
