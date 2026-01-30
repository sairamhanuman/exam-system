const express = require("express");
const router = express.Router();
console.log("✅ staff routes loaded");

const db = require("../config/db");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

/* ================= UPLOAD FOLDER ================= */
// Use path.resolve to make sure it's always relative to project root
const uploadDir = path.resolve("public/uploads/staff");

// Create folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ================= MULTER STORAGE ================= */
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, "_");
    cb(null, Date.now() + "_" + cleanName);
  }
});

const upload = multer({ storage });

/* ================= ADD STAFF ================= */
router.post("/add", upload.single("photo"), async (req, res) => {
  try {
    const photo = req.file ? req.file.filename : null;
    const status = req.body.status || "Working";

    console.log("Uploaded file path:", req.file?.path); // Debug log

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
        status
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* ================= UPDATE STAFF ================= */
router.post("/update/:id", upload.single("photo"), async (req, res) => {
  try {
    const id = req.params.id;

    // Use old photo if no new photo uploaded
    let photo = req.body.old_photo || null;
    if (req.file) {
      photo = req.file.filename;
    }

    const status = req.body.status || "Working";

    await db.query(
      `UPDATE staff_master SET
        emp_id=?, staff_name=?, department=?, designation=?, experience=?,
        mobile=?, email=?, gender=?, doj=?,
        bank_name=?, bank_branch=?, account_no=?, ifsc_code=?,
        pan_no=?, photo=?, status=?
      WHERE id=?`,
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
        status,
        id
      ]
    );

    console.log("Updated staff:", id, "Photo:", photo);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* ================= LIST STAFF ================= */
router.get("/list", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM staff_master ORDER BY staff_name"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* ================= DELETE STAFF ================= */
router.delete("/delete/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM staff_master WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
