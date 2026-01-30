const express = require("express");
const router = express.Router();
const db = require("../config/db"); // promise pool

/* ======================
   ADD SEMESTER
====================== */
router.post("/add", async (req, res) => {
  try {
    const { semester_name } = req.body;

    if (!semester_name) {
      return res.json({ success: false, message: "Semester required" });
    }

    await db.query(
      "INSERT INTO semester_master (semester_name) VALUES (?)",
      [semester_name]
    );

    res.json({ success: true });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.json({ success: false, message: "Semester already exists" });
    }
    res.json({ success: false, message: err.message });
  }
});

/* ======================
   LIST SEMESTERS
====================== */
router.get("/list", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM semester_master WHERE status=1 ORDER BY id"
    );
    res.json(rows);
  } catch (err) {
    res.json([]);
  }
});

/* ======================
   UPDATE SEMESTER
====================== */
router.put("/update/:id", async (req, res) => {
  try {
    const { semester_name } = req.body;
    await db.query(
      "UPDATE semester_master SET semester_name=? WHERE id=?",
      [semester_name, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

/* ======================
   DELETE SEMESTER
====================== */
router.delete("/delete/:id", async (req, res) => {
  try {
    await db.query(
      "UPDATE semester_master SET status=0 WHERE id=?",
      [req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;
