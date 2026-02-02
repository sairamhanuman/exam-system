const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ================= GET FILTER DROPDOWNS =================
router.get("/filters", (req, res) => {

  const filters = {};

  db.query("SELECT programme_name FROM programme_master", (e1, r1) => {
    if (e1) return res.status(500).json(e1);
    filters.programmes = r1;

    db.query("SELECT branch_name FROM branch_master", (e2, r2) => {
      if (e2) return res.status(500).json(e2);
      filters.branches = r2;

      db.query("SELECT semester FROM semester_master", (e3, r3) => {
        if (e3) return res.status(500).json(e3);
        filters.semesters = r3;

        db.query("SELECT regulation FROM regulation_master", (e4, r4) => {
          if (e4) return res.status(500).json(e4);
          filters.regulations = r4;

          db.query("SELECT course_name FROM course_master", (e5, r5) => {
            if (e5) return res.status(500).json(e5);
            filters.courses = r5;

            db.query("SELECT batch FROM batch_master", (e6, r6) => {
              if (e6) return res.status(500).json(e6);
              filters.batches = r6;

              db.query("SELECT section FROM section_master", (e7, r7) => {
                if (e7) return res.status(500).json(e7);
                filters.sections = r7;

                db.query("SELECT staff_name FROM staff_master", (e8, r8) => {
                  if (e8) return res.status(500).json(e8);
                  filters.faculty = r8;

                  res.json(filters);
                });
              });
            });
          });
        });
      });
    });
  });
});

// ================= SAVE MAPPING =================
router.post("/save", (req, res) => {

  const {
    programme,
    branch,
    semester,
    regulation,
    course,
    batch,
    section,
    faculty
  } = req.body;

  const sql = `
    INSERT INTO course_faculty_mapping
    (programme, branch, semester, regulation, course, batch, section, faculty)
    VALUES (?,?,?,?,?,?,?,?)
  `;

  db.query(
    sql,
    [programme, branch, semester, regulation, course, batch, section, faculty],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Course mapped successfully" });
    }
  );
});

// ================= LIST MAPPINGS =================
router.get("/list", (req, res) => {

  const sql = `
    SELECT id, course, batch, section, faculty
    FROM course_faculty_mapping
    ORDER BY id DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// ================= DELETE =================
router.delete("/:id", (req, res) => {

  db.query(
    "DELETE FROM course_faculty_mapping WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Deleted successfully" });
    }
  );
});

module.exports = router;
