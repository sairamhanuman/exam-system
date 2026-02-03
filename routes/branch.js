const express = require("express");
const router = express.Router();
const db = require("../config/db"); // promise pool

/* ======================
   ADD BRANCH
====================== */
router.post("/add", async (req, res) => {
  try {
    const { programme_id, branch_name } = req.body;

    const sql =
      "INSERT INTO branch_master (programme_id, branch_name) VALUES (?, ?)";
    await db.query(sql, [programme_id, branch_name]);

    res.json({ success: true });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.json({ success: false, message: "Branch already exists" });
    }
    res.json({ success: false, message: err.message });
  }
});

/* ======================
   LIST BRANCHES
====================== */
router.get("/list", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        b.id,
        b.programme_id,
        b.branch_name,
        COALESCE(p.programme_name, '❌ Missing Programme') AS programme_name
      FROM branch_master b
      LEFT JOIN programme_master p
        ON b.programme_id = p.id
      WHERE b.status = 1
      ORDER BY b.id
    `);

    res.json(rows);
  } catch (err) {
    console.error("Branch list error:", err);
    res.json([]);
  }
});


/* ======================
   DELETE BRANCH
====================== */
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM branch_master WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

/* ======================
   UPDATE BRANCH
====================== */
router.put("/update/:id", async (req, res) => {
  try {
    const { programme_id, branch_name } = req.body;
    const sql =
      "UPDATE branch_master SET programme_id=?, branch_name=? WHERE id=?";
    await db.query(sql, [programme_id, branch_name, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;
