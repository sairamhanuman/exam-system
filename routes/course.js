const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* ======================
   LIST COURSES
====================== */
router.get("/list", async (req, res) => {
  try {
    const { programme_id, branch_id, semester_id, regulation_id } = req.query;

    const [rows] = await db.query(
      `SELECT * FROM course_master
       WHERE programme_id=? AND branch_id=? AND semester_id=? AND regulation_id=? AND status=1
       ORDER BY course_code`,
      [programme_id, branch_id, semester_id, regulation_id]
    );

    res.json(rows);
  } catch (err) {
    res.json([]);
  }
});

/* ======================
   ADD COURSE
====================== */
router.post("/add", async (req, res) => {
  try {
    const sql = `
      INSERT INTO course_master
      (programme_id, branch_id, semester_id, regulation_id,
       course_code, course_name, exam_type,
       elective, elective_name, replacement,
       credits, ta, internal_marks, external_marks)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;

    await db.query(sql, [
      req.body.programme_id,
      req.body.branch_id,
      req.body.semester_id,
      req.body.regulation_id,
      req.body.course_code,
      req.body.course_name,
      req.body.exam_type,
      req.body.elective || "No",
      req.body.elective_name || null,
      req.body.replacement || "No",
      req.body.credits || 0,
      req.body.ta || 0,
      req.body.internal_marks || 0,
      req.body.external_marks || 0
    ]);

    res.json({ success: true });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.json({ success: false, message: "Course already exists" });
    }
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;
