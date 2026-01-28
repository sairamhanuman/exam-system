const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* ======================
   ADD SEMESTER
====================== */
router.post("/add", (req, res) => {

  const { semester_name } = req.body;

  if (!semester_name) {
    return res.json({
      success: false,
      message: "Semester required"
    });
  }

  const sql =
    "INSERT INTO semester_master (semester_name) VALUES (?)";

  db.query(sql, [semester_name], (err) => {

    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.json({
          success: false,
          message: "Semester already exists"
        });
      }
      return res.json({
        success: false,
        message: err.message
      });
    }

    res.json({ success: true });
  });
});

/* ======================
   LIST SEMESTERS
====================== */
router.get("/list", (req, res) => {

  db.query(
    "SELECT * FROM semester_master WHERE status=1 ORDER BY id",
    (err, rows) => {
      if (err) return res.json([]);
      res.json(rows);
    }
  );
});

/* ======================
   UPDATE SEMESTER
====================== */
router.put("/update/:id", (req, res) => {

  const { semester_name } = req.body;

  db.query(
    "UPDATE semester_master SET semester_name=? WHERE id=?",
    [semester_name, req.params.id],
    (err) => {
      if (err)
        return res.json({ success: false });

      res.json({ success: true });
    }
  );
});

/* ======================
   DELETE SEMESTER
====================== */
router.delete("/delete/:id", (req, res) => {

  db.query(
    "UPDATE semester_master SET status=0 WHERE id=?",
    [req.params.id],
    (err) => {
      if (err)
        return res.json({ success: false });

      res.json({ success: true });
    }
  );
});

module.exports = router;
