const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* ======================
   ADD Batch
====================== */
router.post("/add", (req, res) => {

  const { batch_name } = req.body;

  if (!batch_name) {
    return res.json({
      success: false,
      message: "batch required"
    });
  }

  const sql =
    "INSERT INTO batch_master (batch_name) VALUES (?)";

  db.query(sql, [batch_name], err => {

    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.json({
          success: false,
          message: "Batch already exists"
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
   LIST REGULATION
====================== */
router.get("/list", (req, res) => {

  db.query(
    "SELECT * FROM batch_master WHERE status=1 ORDER BY id",
    (err, rows) => {
      if (err) return res.json([]);
      res.json(rows);
    }
  );
});

/* ======================
   DELETE REGULATION (PERMANENT)
====================== */
router.delete("/delete/:id", (req, res) => {

  db.query(
    "DELETE FROM batch_master WHERE id=?",
    [req.params.id],
    err => {
      if (err) {
        return res.json({ success: false, message: err.message });
      }
      res.json({ success: true });
    }
  );

});


/* ======================
   UPDATE REGULATION
====================== */
router.put("/update/:id", (req, res) => {

  const { batch_name } = req.body;

  db.query(
    "UPDATE batch_master SET batch_name=? WHERE id=?",
    [batch_name, req.params.id],
    err => {
      if (err) {
        return res.json({ success: false, message: err.message });
      }
      res.json({ success: true });
    }
  );
});

module.exports = router;
