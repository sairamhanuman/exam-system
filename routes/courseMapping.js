const express = require("express");
const router = express.Router();
const db = require("../config/db");

/**
 * GET FILTERS
 * Programme → Branch → Semester → Regulation → Course
 */
router.get("/filters", async (req, res) => {
  try {
    const [programmes] = await db.query(
      "SELECT id, programme_name FROM programme_master WHERE status=1"
    );

    const [branches] = await db.query(
      "SELECT id, branch_name FROM branch_master WHERE status=1"
    );

    const [semesters] = await db.query(
      "SELECT id, semester_name FROM semester_master WHERE status=1"
    );

    const [regulations] = await db.query(
      "SELECT id, regulation_name FROM regulation_master WHERE status=1"
    );

    const [courses] = await db.query(
      `SELECT id, course_code, course_name 
       FROM course_master WHERE status=1`
    );

    res.json({
      programmes,
      branches,
      semesters,
      regulations,
      courses
    });

  } catch (err) {
    console.error("❌ filters error:", err);
    res.status(500).json({ message: "Filters load failed" });
  }
});

/**
 * DROPDOWNS
 */
router.get("/extras", async (req, res) => {
  try {
    const [batches] = await db.query(
      "SELECT id, batch_name FROM batch_master WHERE status=1"
    );

    const [sections] = await db.query(
      "SELECT id, section_name FROM section_master WHERE status=1"
    );

    const [staff] = await db.query(
      `SELECT id,
              CONCAT(department,'-',emp_id,'-',staff_name) AS staff_name
       FROM staff_master`
    );

    res.json({ batches, sections, staff });

  } catch (err) {
    console.error("❌ extras error:", err);
    res.status(500).json({ message: "Extras load failed" });
  }
});

module.exports = router;
