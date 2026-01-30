const express = require("express");
const router = express.Router();
const db = require("../config/db"); // this is promise pool now

/* ======================
   ADD Batch
====================== */
router.post("/add", async (req, res) => {
  try {
    const { batch_name } = req.body;

    if (!batch_name) {
      return res.json({ success: false, message: "batch required" });
    }

    const sql = "INSERT INTO batch_master (batch_name) VALUES (?)";
    await db.query(sql, [batch_name]); // async/await

    res.json({ success: true });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.json({ success: false, message: "Batch already exists" });
    }
    res.json({ success: false, message: err.message });
  }
});

/* ======================
   LIST BATCH
====================== */
router.get("/list", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM batch_master WHERE status=1 ORDER BY id"
    );
    res.json(rows);
  } catch (err) {
    res.json([]);
  }
});

/* ======================
   DELETE BATCH
====================== */
router.delete("/delete/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM batch_master WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

/* ======================
   UPDATE BATCH
====================== */
router.put("/update/:id", async (req, res) => {
  try {
    const { batch_name } = req.body;
    await db.query(
      "UPDATE batch_master SET batch_name=? WHERE id=?",
      [batch_name, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;
