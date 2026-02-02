const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* ================= FILTERS FROM course_master ================= */
router.get("/filters", async (req, res) => {
  try {
    const [programmes] = await db.query(`
      SELECT DISTINCT programme, programme AS programme_name
      FROM course_master
      WHERE programme IS NOT NULL
    `);

    const [branches] = await db.query(`
      SELECT DISTINCT branch, branch AS branch_name
      FROM course_master
      WHERE branch IS NOT NULL
    `);

    const [semesters] = await db.query(`
      SELECT DISTINCT semester, semester AS semester_name
      FROM course_master
      WHERE semester IS NOT NULL
    `);

    const [regulations] = await db.query(`
      SELECT DISTINCT regulation, regulation AS regulation_name
      FROM course_master
      WHERE regulation IS NOT NULL
    `);

    const [courses] = await db.query(`
      SELECT id, course_code, course_name
      FROM course_master
    `);

    res.json({ programmes, branches, semesters, regulations, courses });
  } catch (err) {
    console.error("❌ filters error:", err);
    res.status(500).json(err);
  }
});

/* ================= EXTRAS ================= */
router.get("/extras", async (req, res) => {
  try {
    const [batches] = await db.query(
      "SELECT id, batch_name FROM batch_master"
    );

    const [sections] = await db.query(
      "SELECT id, section_name FROM section_master"
    );

    const [staff] = await db.query(`
      SELECT id,
      CONCAT(department,'-',emp_id,'-',staff_name) AS staff_name
      FROM staff_master
      WHERE status != 'Relieved'
    `);

    res.json({ batches, sections, staff });
  } catch (err) {
    console.error("❌ extras error:", err);
    res.status(500).json(err);
  }
});

module.exports = router;
