const express = require("express");
const router = express.Router();
const db = require("../config/db"); // promise pool

/* =========================
   ADD PROGRAMME
========================= */
router.post("/add", async (req, res) => {
  try {
    const { programme_name } = req.body;

    if (!programme_name) {
      return res.json({ success: false, message: "Programme required" });
    }

    const sql = "INSERT INTO programme_master (programme_name) VALUES (?)";
    await db.query(sql, [programme_name]);

    res.json({ success: true });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.json({ success: false, message: "Programme already exists" });
    }
    res.json({ success: false, message: err.message });
  }
});

/* =========================
   GET PROGRAMME LIST
========================= */
router.get("/list", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM programme_master WHERE status=1 ORDER BY programme_name"
    );
    res.json(rows);
  } catch (err) {
    res.json([]);
  }
});

/* =========================
   UPDATE PROGRAMME
========================= */
router.put("/update/:id", async (req, res) => {
  try {
    const { programme_name } = req.body;
    await db.query(
      "UPDATE programme_master SET programme_name=? WHERE id=?",
      [programme_name, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

/* =========================
   DELETE PROGRAMME
========================= */
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM programme_master WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;
