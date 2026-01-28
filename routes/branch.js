const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* ======================
   ADD BRANCH
====================== */
router.post("/add", (req, res) => {
  const { programme_id, branch_name } = req.body;

  const sql =
    "INSERT INTO branch_master (programme_id, branch_name) VALUES (?, ?)";

  db.query(sql, [programme_id, branch_name], err => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.json({ success: false, message: "Branch already exists" });
      }
      return res.json({ success: false, message: err.message });
    }
    res.json({ success: true });
  });
});

/* ======================
   LIST BRANCHES
====================== */
router.get("/list", (req, res) => {
  const sql = `
    SELECT 
  b.id,
  b.branch_name,
  b.programme_id,
  p.programme_name
FROM branch_master b
JOIN programme_master p ON p.id = b.programme_id
ORDER BY p.programme_name, b.branch_name
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.json([]);
    res.json(rows);
  });
});

/* ======================
   DELETE BRANCH
====================== */
router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM branch_master WHERE id=?",
    [req.params.id],
    err => {
      if (err) return res.json({ success: false });
      res.json({ success: true });
    }
  );
});
/* ======================
   UPDATE BRANCH
====================== */
router.put("/update/:id", (req, res) => {
  const { programme_id, branch_name } = req.body;

  const sql =
    "UPDATE branch_master SET programme_id=?, branch_name=? WHERE id=?";

  db.query(sql, [programme_id, branch_name, req.params.id], err => {
    if (err) return res.json({ success: false });
    res.json({ success: true });
  });
});

module.exports = router;
