const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* ======================
   ADD SECTION
====================== */
router.post("/add", (req, res) => {

  const { section_name } = req.body;

  if (!section_name) {
    return res.json({ success: false });
  }

  db.query(
    "INSERT INTO section_master (section_name) VALUES (?)",
    [section_name],
    err => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.json({
            success: false,
            message: "Section already exists"
          });
        }
        return res.json({ success: false });
      }

      res.json({ success: true });
    }
  );
});

/* ======================
   LIST SECTIONS
====================== */
router.get("/list", (req, res) => {

  db.query(
    "SELECT * FROM section_master ORDER BY section_name",
    (err, rows) => {
      if (err) return res.json([]);
      res.json(rows);
    }
  );
});

/* ======================
   UPDATE SECTION
====================== */
router.put("/update/:id", (req, res) => {

  const { section_name } = req.body;

  db.query(
    "UPDATE section_master SET section_name=? WHERE id=?",
    [section_name, req.params.id],
    err => {
      if (err) return res.json({ success: false });
      res.json({ success: true });
    }
  );
});

/* ======================
   PERMANENT DELETE
====================== */
router.delete("/delete/:id", (req, res) => {

  db.query(
    "DELETE FROM section_master WHERE id=?",
    [req.params.id],
    err => {
      if (err) return res.json({ success: false });
      res.json({ success: true });
    }
  );
});

module.exports = router;
