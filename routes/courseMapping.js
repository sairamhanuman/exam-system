const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* ================= FILTERS (FROM course_master ONLY) ================= */
router.get("/filters", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DISTINCT
        cm.programme_id,
        pm.programme_name,

        cm.branch_id,
        bm.branch_name,

        cm.semester_id,
        sm.semester_name,

        cm.regulation_id,
        rm.regulation_name
      FROM course_master cm
      JOIN programme_master pm ON pm.id = cm.programme_id
      JOIN branch_master bm ON bm.id = cm.branch_id
      JOIN semester_master sm ON sm.id = cm.semester_id
      JOIN regulation_master rm ON rm.id = cm.regulation_id
      WHERE cm.status = 1
    `);

    const [courses] = await db.query(`
      SELECT
        id,
        programme_id,
        branch_id,
        semester_id,
        regulation_id,
        course_code,
        course_name
      FROM course_master
      WHERE status = 1
    `);

    res.json({ filters: rows, courses });
  } catch (err) {
    console.error("❌ course-mapping filters error:", err);
    res.status(500).json(err);
  }
});

/* ================= EXTRAS ================= */
router.get("/extras", async (req, res) => {
  try {
    const [batches] = await db.query(
      "SELECT id, batch_name FROM batch_master WHERE status = 1"
    );

    const [sections] = await db.query(
      "SELECT id, section_name FROM section_master WHERE status = 1"
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
