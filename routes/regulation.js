const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* ======================
   ADD REGULATION
====================== */
router.post("/add", (req, res) => {

  const { regulation_name } = req.body;

  if (!regulation_name) {
    return res.json({
      success: false,
      message: "Regulation required"
    });
  }

  const sql =
    "INSERT INTO regulation_master (regulation_name) VALUES (?)";

  db.query(sql, [regulation_name], err => {

    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.json({
          success: false,
          message: "Regulation already exists"
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
    "SELECT * FROM regulation_master WHERE status=1 ORDER BY id",
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
    "DELETE FROM regulation_master WHERE id=?",
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

  const { regulation_name } = req.body;

  db.query(
    "UPDATE regulation_master SET regulation_name=? WHERE id=?",
    [regulation_name, req.params.id],
    err => {
      if (err) {
        return res.json({ success: false, message: err.message });
      }
      res.json({ success: true });
    }
  );
});

module.exports = router;
