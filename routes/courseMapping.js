const express = require("express");
const router = express.Router();
const db = require("../config/db");


/* ================= FILTERS ================= */
router.get("/filters", async (req, res) => {
  try {
    const [filters] = await db.query(`
      SELECT DISTINCT
        c.programme_id,
        p.programme_name,
        c.branch_id,
        b.branch_name,
        c.semester_id,
        s.semester_name,
        c.regulation_id,
        r.regulation_name
      FROM course_master c
      JOIN programme_master p ON p.id = c.programme_id
      JOIN branch_master b ON b.id = c.branch_id
      JOIN semester_master s ON s.id = c.semester_id
      JOIN regulation_master r ON r.id = c.regulation_id
      WHERE c.status = 1
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

    res.json({ filters, courses });
  } catch (err) {
    console.error("filters error", err);
    res.status(500).json(err);
  }
});

/* ================= FILTERS (FROM course_master ONLY) ================= */
router.get("/list", async (req, res) => {
  try {
    const { programme_id, branch_id, semester_id, regulation_id } = req.query;

    const [rows] = await db.query(`
      SELECT 
        c.course_code,
        c.course_name,
        b.batch_name,
        s.section_name,
        CONCAT(
          st.department, '-', 
          st.emp_id, '-', 
          st.staff_name
        ) AS faculty_name,
        m.id
      FROM course_faculty_mapping m
      JOIN course_master c ON c.id = m.course_id
      JOIN batch_master b ON b.id = m.batch_id
      JOIN section_master s ON s.id = m.section_id
      JOIN staff_master st ON st.id = m.staff_id
      WHERE
        m.programme_id = ?
        AND m.branch_id = ?
        AND m.semester_id = ?
        AND m.regulation_id = ?
        AND m.status = 1
    `, [programme_id, branch_id, semester_id, regulation_id]);

    res.json(rows);
  } catch (err) {
    console.error("LIST ERROR:", err);
    res.status(500).json({ error: "Failed to load mappings" });
  }
});


/* ================= EXTRAS ================= */

/* ===== EXTRAS ===== */
router.get("/extras", async (req, res) => {
  const [batches] = await db.query(
    "SELECT id, batch_name FROM batch_master WHERE status=1"
  );

  const [sections] = await db.query(
    "SELECT id, section_name FROM section_master WHERE status=1"
  );

  const [staff] = await db.query(`
    SELECT id,
    CONCAT(department,'-',emp_id,'-',staff_name) AS staff_name
    FROM staff_master
    WHERE status='Working' OR status='Relieved'
  `);

  res.json({ batches, sections, staff });
});

/* ===== SAVE ===== */
router.post("/save", async (req, res) => {
  try {
    await db.query(
      `INSERT INTO course_faculty_mapping
      (programme_id, branch_id, semester_id, regulation_id,
       course_id, batch_id, section_id, staff_id)
       VALUES (?,?,?,?,?,?,?,?)`,
      [
        req.body.programme_id,
        req.body.branch_id,
        req.body.semester_id,
        req.body.regulation_id,
        req.body.course_id,
        req.body.batch_id,
        req.body.section_id,
        req.body.staff_id
      ]
    );

    res.json({ message: "Mapping saved successfully" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      res.json({ message: "Already mapped" });
    } else {
      res.status(500).json(err);
    }
  }
});

/* ===== GET ONE MAPPING ===== */
router.get("/get/:id", async (req, res) => {
  const [rows] = await db.query(
    `SELECT * FROM course_faculty_mapping WHERE id = ?`,
    [req.params.id]
  );

  res.json(rows[0]);
});


/* ===== SOFT DELETE ===== */
router.delete("/delete/:id", async (req, res) => {
  try {
    await db.query(
      `UPDATE course_faculty_mapping 
       SET status = 0 
       WHERE id = ?`,
      [req.params.id]
    );

    res.json({ message: "Mapping deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

/* ===== UPDATE ===== */
router.put("/update/:id", async (req, res) => {
  try {
    await db.query(
      `UPDATE course_faculty_mapping SET
        batch_id = ?,
        section_id = ?,
        staff_id = ?
       WHERE id = ?`,
      [
        req.body.batch_id,
        req.body.section_id,
        req.body.staff_id,
        req.params.id
      ]
    );

    res.json({ message: "Mapping updated successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
