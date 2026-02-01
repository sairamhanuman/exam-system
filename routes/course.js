const express = require("express");
const router = express.Router();
const db = require("../config/db");
const XLSX = require("xlsx");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });


/* ADD */
router.post("/add", async (req, res) => {
  await db.query(
    `INSERT INTO course_master
    (programme_id, branch_id, semester_id, regulation_id,
     course_code, course_name, course_short, exam_type, elective, elective_name,
     replacement, credits, ta, internal_marks, external_marks)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    Object.values(req.body)
  );
  res.json({ success: true });
});

/* LIST */
router.get("/list", async (req, res) => {
  try {
    const { programme_id, branch_id, semester_id, regulation_id } = req.query;

    const [rows] = await db.query(
      `SELECT * FROM course_master
       WHERE status=1
       AND programme_id=?
       AND branch_id=?
       AND semester_id=?
       AND regulation_id=?
       ORDER BY course_code`,
      [programme_id, branch_id, semester_id, regulation_id]
    );

    res.json(rows);
  } catch (err) {
    res.json([]);
  }
});


/* UPDATE */
router.put("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await db.query(
      `UPDATE course_master SET
        course_name=?,
        course_short=?,
        exam_type=?,
        elective=?,
        elective_name=?,
        replacement=?,
        credits=?,
        ta=?,
        internal_marks=?,
        external_marks=?
       WHERE id=?`,
      [
        req.body.course_name,
        req.body.course_short,
        req.body.exam_type,
        req.body.elective,
        req.body.elective_name,
        req.body.replacement,
        req.body.credits,
        req.body.ta,
        req.body.internal_marks,
        req.body.external_marks,
        id
      ]
    );

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});


/* ======================
   SOFT DELETE COURSE
====================== */
router.delete("/delete/:id", async (req, res) => {
  try {
    await db.query(
      "UPDATE course_master SET status=0 WHERE id=?",
      [req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

/* ======================
   download excel COURSE
====================== */
router.post("/add", (req, res) => {
  const {
    programme_id,
    branch_id,
    semester_id,
    regulation_id,
    course_code,
    course_name,
    course_short,
    order_no,
    exam_type,
    credits
  } = req.body;

  const sql = `
    INSERT INTO course_master
    (programme_id, branch_id, semester_id, regulation_id,
     course_code, course_name, course_short, order_no,
     exam_type, credits)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      programme_id,
      branch_id,
      semester_id,
      regulation_id,
      course_code,
      course_name,
      course_short,
      order_no,
      exam_type,
      credits
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Insert failed" });
      }
      res.json({ message: "Course added successfully" });
    }
  );
});

/* ======================
    upload COURSE
====================== */

router.post("/upload-excel", upload.single("file"), async (req, res) => {
  try {
    const workbook = XLSX.read(req.file.buffer);
    const sheet = workbook.Sheets["Courses"];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    // Remove header info (first 5 rows)
    const courses = rows.slice(5);

    for (let row of courses) {
      // DUPLICATE CHECK (order_no within branch+sem+reg)
      const [dup] = await db.query(
        `SELECT id FROM course_master
         WHERE programme_id=? AND branch_id=? AND semester_id=? AND regulation_id=?
         AND order_no=? AND status=1`,
        [
          req.body.programme_id,
          req.body.branch_id,
          req.body.semester_id,
          req.body.regulation_id,
          row.order_no
        ]
      );

      if (dup.length > 0) {
        return res.json({
          success: false,
          message: `Duplicate order_no: ${row.order_no}`
        });
      }

      await db.query(
        `INSERT INTO course_master
        (programme_id, branch_id, semester_id, regulation_id,
         order_no, course_code, course_name, course_short,
         exam_type, elective, elective_name, replacement,
         credits, ta, internal_marks, external_marks)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.body.programme_id,
          req.body.branch_id,
          req.body.semester_id,
          req.body.regulation_id,
          row.order_no,
          row.course_code,
          row.course_name,
          row.course_short,
          row.exam_type,
          row.elective,
          row.elective_name,
          row.replacement,
          row.credits,
          row.ta,
          row.internal_marks,
          row.external_marks
        ]
      );
    }

    res.json({ success: true, message: "Courses uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
