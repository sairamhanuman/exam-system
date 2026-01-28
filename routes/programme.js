const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* =========================
   ADD PROGRAMME
========================= */

router.post("/add", (req, res) => {
  const { programme_name } = req.body;

  if (!programme_name) {
    return res.json({ success: false, message: "Programme required" });
  }

  const sql = "INSERT INTO programme_master (programme_name) VALUES (?)";

  db.query(sql, [programme_name], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.json({
          success: false,
          message: "Programme already exists"
        });
      }
      return res.json({ success: false, message: err.message });
    }

    res.json({ success: true });
  });
});

/* =========================
   GET PROGRAMME LIST
========================= */

router.get("/list", (req, res) => {
  db.query(
    "SELECT * FROM programme_master WHERE status=1 ORDER BY programme_name",
    (err, rows) => {
      if (err) return res.json([]);

      res.json(rows);
    }
  );
});


/* =========================
   UPDATE PROGRAMME
========================= */
router.put("/update/:id", (req, res) => {
  const { programme_name } = req.body;

  db.query(
    "UPDATE programme_master SET programme_name=? WHERE id=?",
    [programme_name, req.params.id],
    err => {
      if (err) {
        return res.json({ success: false, message: err.message });
      }
      res.json({ success: true });
    }
  );
});

/* =========================
   DELETE PROGRAMME
========================= */
router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM programme_master WHERE id=?",
    [req.params.id],
    err => {
      if (err) {
        return res.json({ success: false, message: err.message });
      }
      res.json({ success: true });
    }
  );
});

module.exports = router;
