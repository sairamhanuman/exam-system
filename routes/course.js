const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* ADD */
router.post("/add", async (req, res) => {
  await db.query(
    `INSERT INTO course_master
    (programme_id, branch_id, semester_id, regulation_id,
     course_code, course_name, exam_type, elective, elective_name,
     replacement, credits, ta, internal_marks, external_marks)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    Object.values(req.body)
  );
  res.json({ success: true });
});

/* LIST */
router.get("/list", async (req, res) => {
  const { programme_id, branch_id, semester_id, regulation_id } = req.query;

  const [rows] = await db.query(
    `SELECT * FROM course_master
     WHERE programme_id=? AND branch_id=?
     AND semester_id=? AND regulation_id=?`,
    [programme_id, branch_id, semester_id, regulation_id]
  );

  res.json(rows);
});

module.exports = router;
