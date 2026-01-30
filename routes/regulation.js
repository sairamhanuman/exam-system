const express = require("express");
const router = express.Router();
const db = require("../config/db"); // promise pool

/* ======================
   ADD REGULATION
===================== */
router.post("/add", async (req, res) => {
  try {
    const { regulation_name } = req.body;

    if (!regulation_name) {
      return res.json({ success: false, message: "Regulation required" });
    }

    const sql = "INSERT INTO regulation_master (regulation_name) VALUES (?)";
    await db.query(sql, [regulation_name]);

    res.json({ success: true });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.json({ success: false, message: "Regulation already exists" });
    }
    res.json({ success: false, message: err.message });
  }
});

/* ======================
   LIST REGULATION
===================== */
router.get("/list", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM regulation_master WHERE status=1 ORDER BY id"
    );
    res.json(rows);
  } catch (err) {
    res.json([]);
  }
});

/* ======================
   DELETE REGULATION (PERMANENT)
===================== */
router.delete("/delete/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM regulation_master WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

/* ======================
   UPDATE REGULATION
===================== */
router.put("/update/:id", async (req, res) => {
  try {
    const { regulation_name } = req.body;
    await db.query(
      "UPDATE regulation_master SET regulation_name=? WHERE id=?",
      [regulation_name, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;
