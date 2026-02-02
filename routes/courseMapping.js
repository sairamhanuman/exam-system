const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/filters", async (req, res) => {
  const q = sql => new Promise((ok, bad) =>
    db.query(sql, (e, r) => e ? bad(e) : ok(r))
  );

  try {
    res.json({
      programmes: await q(`SELECT id, programme_name AS name FROM programme_master WHERE status=1`),
      branches: await q(`SELECT id, branch_name AS name FROM branch_master WHERE status=1`),
      semesters: await q(`SELECT id, semester_name AS name FROM semester_master WHERE status=1`),
      regulations: await q(`SELECT id, regulation_name AS name FROM regulation_master WHERE status=1`),

      courses: await q(`
        SELECT id, course_code, course_name
        FROM course_master WHERE status=1
      `),

      batches: await q(`SELECT id, batch_name AS name FROM batch_master WHERE status=1`),
      sections: await q(`SELECT id, section_name AS name FROM section_master WHERE status=1`),

      staff: await q(`
        SELECT id, emp_id, staff_name, department
        FROM staff_master
      `)
    });
  } catch (e) {
    res.status(500).json(e);
  }
});

router.post("/save", (req, res) => {
  db.query("INSERT INTO course_faculty_mapping SET ?", req.body,
    err => err ? res.status(500).json(err) : res.json({ success: true })
  );
});

router.get("/list", (req, res) => {
  const sql = `
    SELECT m.id,
      p.programme_name programme,
      b.branch_name branch,
      s.semester_name semester,
      r.regulation_name regulation,
      CONCAT(c.course_code,'-',c.course_name) course,
      bt.batch_name batch,
      se.section_name section,
      CONCAT(st.department,'-',st.emp_id,'-',st.staff_name) faculty
    FROM course_faculty_mapping m
    JOIN programme_master p ON m.programme_id=p.id
    JOIN branch_master b ON m.branch_id=b.id
    JOIN semester_master s ON m.semester_id=s.id
    JOIN regulation_master r ON m.regulation_id=r.id
    JOIN course_master c ON m.course_id=c.id
    JOIN batch_master bt ON m.batch_id=bt.id
    JOIN section_master se ON m.section_id=se.id
    JOIN staff_master st ON m.staff_id=st.id
  `;
  db.query(sql, (e, r) => e ? res.status(500).json(e) : res.json(r));
});

router.delete("/delete/:id", (req, res) => {
  db.query("DELETE FROM course_faculty_mapping WHERE id=?",
    [req.params.id],
    () => res.json({ success: true })
  );
});

module.exports = router;
