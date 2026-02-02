const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* Filters */
router.get("/filters", (req,res) => {
  db.query(`SELECT DISTINCT programme,branch,semester,regulation FROM course_master`,
    (e,r) => {
      const col = c => [...new Set(r.map(x => x[c]))];
      res.json({
        programme: col("programme"),
        branch: col("branch"),
        semester: col("semester"),
        regulation: col("regulation")
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

/* List */
router.get("/list", (req,res) => {
  db.query(`SELECT * FROM course_faculty_mapping`, (e,r) => res.json(r));
});

/* Delete */
router.delete("/delete/:id", (req,res) => {
  db.query(`DELETE FROM course_faculty_mapping WHERE id=?`,
    [req.params.id], () => res.json({msg:"deleted"}));
});

module.exports = router;
