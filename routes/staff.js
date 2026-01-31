const express = require("express");
const router = express.Router();
console.log("✅ staff routes loaded");

const db = require("../config/db");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

/* ================= UPLOAD FOLDER ================= */

const uploadDir = path.join(__dirname, "../public/uploads/staff");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ================= MULTER ================= */

const storage = multer.diskStorage({
  destination: uploadDir,
filename: (req, file, cb) => {
  const cleanName = file.originalname.replace(/\s+/g, "_");
  cb(null, Date.now() + "_" + cleanName);
}

});

const upload = multer({ storage });

/* ================= ADD ================= */

router.post("/add", upload.single("photo"), async (req, res) => {
  try {

    const photo = req.file ? req.file.filename : null;
    const status = req.body.status || "Working";

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

/* ================= UPDATE ================= */

router.post("/update/:id", upload.single("photo"), async (req, res) => {
  try {

    const id = req.params.id;

    let photo = req.body.old_photo || null;

    if (req.file) {
      photo = req.file.filename;
    }

    const status = req.body.status || "Working";

    await db.query(
      `UPDATE staff_master SET
        emp_id=?,
        staff_name=?,
        department=?,
        designation=?,
        experience=?,
        mobile=?,
        email=?,
        gender=?,
        doj=?,
        bank_name=?,
        bank_branch=?,
        account_no=?,
        ifsc_code=?,
        pan_no=?,
        photo=?,
        status=?
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

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
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
