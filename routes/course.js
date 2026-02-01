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

module.exports = router;
