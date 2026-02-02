const express = require("express");
const router = express.Router();
const db = require("../config/db");

/**
 * GET ALL FILTER DATA
 */
router.get("/filters", async (req, res) => {
  try {
    const q = (sql) =>
      new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

    const data = {
      programmes: await q("SELECT id, programme_name FROM programme_master WHERE status = 1"),
      branches: await q("SELECT id, programme_id, branch_name FROM branch_master WHERE status = 1"),
      semesters: await q("SELECT id, semester_name FROM semester_master WHERE status = 1"),
      regulations: await q("SELECT id, regulation_name FROM regulation_master WHERE status = 1"),
      courses: await q(`
        SELECT id, programme_id, branch_id, semester_id, regulation_id,
               course_code, course_name
        FROM course_master
        WHERE status = 1
      `),
      batches: await q("SELECT id, batch_name FROM batch_master WHERE status = 1"),
      sections: await q("SELECT id, section_name FROM section_master WHERE status = 1"),
staff: await q(`
  SELECT id, branch_id, employee_id, employee_name
  FROM staff_master
  WHERE status = 1
`)
  
    };

    res.json(data);
  } catch (err) {
    console.error("FILTER ERROR:", err);
    res.status(500).json({ message: "Failed to load filters" });
  }
});

/**
 * LIST COURSE–FACULTY MAPPING
 */
router.get("/list", (req, res) => {
  const sql = `
    SELECT 
      m.id,
      CONCAT(c.course_code, ' - ', c.course_name) AS course,
      b.batch_name,
      s.section_name,
      CONCAT(st.department, '-', st.emp_id, '-', st.staff_name) AS faculty
    FROM course_faculty_mapping m
    JOIN course_master c ON m.course_id = c.id
    JOIN batch_master b ON m.batch_id = b.id
    JOIN section_master s ON m.section_id = s.id
    JOIN staff_master st ON m.staff_id = st.id
    ORDER BY m.id DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("LIST ERROR:", err);
      return res.status(500).json({ message: "Failed to load mappings" });
    }
    res.json(rows);
  });
});

module.exports = router;
