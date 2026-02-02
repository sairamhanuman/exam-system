const express = require("express");
const router = express.Router();
const db = require("../config/db"); // ✅ FIXED

router.get("/filters", async (req, res) => {
  const [programmes] = await db.query("SELECT id, programme_name AS name FROM programme_master WHERE status=1");
  const [branches] = await db.query("SELECT id, branch_name AS name FROM branch_master WHERE status=1");
  const [semesters] = await db.query("SELECT id, semester_name AS name FROM semester_master WHERE status=1");
  const [regulations] = await db.query("SELECT id, regulation_name AS name FROM regulation_master WHERE status=1");
  const [courses] = await db.query("SELECT id, CONCAT(course_code,' - ',course_name) AS name FROM course_master WHERE status=1");
  const [batches] = await db.query("SELECT id, batch_name AS name FROM batch_master WHERE status=1");
  const [sections] = await db.query("SELECT id, section_name AS name FROM section_master WHERE status=1");
  const [staff] = await db.query(`
    SELECT id, CONCAT(department,'-',emp_id,'-',staff_name) AS name
    FROM staff_master
  `);

  res.json({ programmes, branches, semesters, regulations, courses, batches, sections, staff });
});

router.post("/save", async (req, res) => {
  await db.query("INSERT INTO course_faculty_mapping SET ?", req.body);
  res.json({ success: true });
});

router.get("/list", async (req, res) => {
  const [rows] = await db.query(`
    SELECT m.id,
      CONCAT(c.course_code,'-',c.course_name) course,
      b.batch_name batch,
      s.section_name section,
      CONCAT(st.department,'-',st.emp_id,'-',st.staff_name) staff
    FROM course_faculty_mapping m
    JOIN course_master c ON c.id=m.course_id
    JOIN batch_master b ON b.id=m.batch_id
    JOIN section_master s ON s.id=m.section_id
    JOIN staff_master st ON st.id=m.staff_id
  `);
  res.json(rows);
});

router.get("/delete/:id", async (req, res) => {
  await db.query("DELETE FROM course_faculty_mapping WHERE id=?", [req.params.id]);
  res.json({ success: true });
});

module.exports = router;
