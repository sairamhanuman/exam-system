const express = require("express");
const router = express.Router();
const db = require("../config/db"); // promise pool

/* ======================
   ADD SECTION
===================== */
router.post("/add", async (req, res) => {
  try {
    const { section_name } = req.body;

    if (!section_name) {
      return res.json({ success: false, message: "Section required" });
    }

    await db.query(
      "INSERT INTO section_master (section_name) VALUES (?)",
      [section_name]
    );

    res.json({ success: true });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.json({ success: false, message: "Section already exists" });
    }
    res.json({ success: false, message: err.message });
  }
});

/* ======================
   LIST SECTIONS
===================== */
router.get("/list", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM section_master ORDER BY section_name"
    );
    res.json(rows);
  } catch (err) {
    res.json([]);
  }
});

/* ======================
   UPDATE SECTION
===================== */
router.put("/update/:id", async (req, res) => {
  try {
    const { section_name } = req.body;
    await db.query(
      "UPDATE section_master SET section_name=? WHERE id=?",
      [section_name, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

/* ======================
   PERMANENT DELETE
===================== */
router.delete("/delete/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM section_master WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;
