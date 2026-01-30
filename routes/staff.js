const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const fs = require("fs");
const path = require("path");


/* ================= PHOTO STORAGE ================= */

const storage = multer.diskStorage({
  destination: "public/uploads/staff",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

const upload = multer({ storage });

/* ================= ADD / UPDATE ================= */
router.post("/add", upload.single("photo"), async (req, res) => {
  try {

    const photo = req.file ? req.file.filename : null;

    await db.query(
      `INSERT INTO staff_master
      (emp_id, staff_name, department, designation, experience,
       mobile, email, gender, doj,
       bank_name, bank_branch, account_no, ifsc_code,
       pan_no, photo, status)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        req.body.emp_id,
        req.body.staff_name,
        req.body.department,
        req.body.designation,
        req.body.experience,
        req.body.mobile,
        req.body.email,
        req.body.gender,
        req.body.doj,

        req.body.bank_name,
        req.body.bank_branch,
        req.body.account_no,
        req.body.ifsc_code,

        req.body.pan_no,
        photo,
        req.body.status
      ]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("STAFF ADD ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});


/* ================= LIST ================= */

router.get("/list", async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM staff_master ORDER BY staff_name"
  );
  res.json(rows);
});

/* ================= DELETE ================= */

router.delete("/delete/:id", async (req, res) => {
  await db.query("DELETE FROM staff_master WHERE id=?", [
    req.params.id
  ]);
  res.json({ success: true });
});

module.exports = router;
