const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* Filters */
/ GET FILTER DROPDOWNS
router.get("/filters", (req, res) => {
  const data = {};

  db.query("SELECT id, programme_name FROM programme_master", (err, programmes) => {
    if (err) return res.status(500).json(err);
    data.programmes = programmes;

    db.query("SELECT id, branch_name FROM branch_master", (err, branches) => {
      if (err) return res.status(500).json(err);
      data.branches = branches;

      db.query("SELECT id, semester_name FROM semester_master", (err, semesters) => {
        if (err) return res.status(500).json(err);
        data.semesters = semesters;

        db.query("SELECT id, regulation FROM regulation_master", (err, regulations) => {
          if (err) return res.status(500).json(err);
          data.regulations = regulations;

          res.json(data); // ✅ ONLY JSON
        });
      });
    });
  });
});

/* Dependent dropdowns */
router.post("/dependent", (req,res) => {
  const { programme,branch,semester,regulation } = req.body;

  db.query(
    `SELECT CONCAT(course_code,' - ',course_name) course
     FROM course_master
     WHERE programme=? AND branch=? AND semester=? AND regulation=?`,
    [programme,branch,semester,regulation],
    (e,courses) => {

      db.query(`SELECT batch FROM batch_master`, (e,batch) => {
        db.query(`SELECT section FROM sectionmaster`, (e,section) => {
          db.query(
            `SELECT CONCAT(branch,'-',emp_id,'-',emp_name) faculty
             FROM staff_master WHERE branch=?`,
            [branch],
            (e,faculty) => {
              res.json({
                courses: courses.map(c=>c.course),
                batch: batch.map(b=>b.batch),
                section: section.map(s=>s.section),
                faculty: faculty.map(f=>f.faculty)
              });
            });
        });
      });
    });
});

/* Save */
router.post("/save", (req,res) => {
  db.query(
    `INSERT INTO course_faculty_mapping
     (programme,branch,semester,regulation,course,batch,section,faculty)
     VALUES (?,?,?,?,?,?,?,?)`,
    Object.values(req.body),
    () => res.json({msg:"saved"})
  );
});

// GET MAPPING LIST
router.get("/list", (req, res) => {
  const sql = `
    SELECT 
      cm.id,
      c.course_code,
      c.course_name,
      cm.batch,
      cm.section,
      CONCAT(s.branch,' - ',s.employee_id,' - ',s.employee_name) AS faculty
    FROM course_mapping cm
    JOIN course_master c ON cm.course_id = c.id
    JOIN staff_master s ON cm.staff_id = s.id
    ORDER BY cm.id DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows); // ✅ JSON ONLY
  });
});

/* Delete */
router.delete("/delete/:id", (req,res) => {
  db.query(`DELETE FROM course_faculty_mapping WHERE id=?`,
    [req.params.id], () => res.json({msg:"deleted"}));
});

module.exports = router;
