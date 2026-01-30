const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary"); // Cloudinary config
const db = require("../config/db");

console.log("✅ staff routes loaded");

/* ================= CLOUDINARY STORAGE ================= */
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "staff_photos",           // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }]
  }
});

const upload = multer({ storage });

/* ================= ADD STAFF ================= */
router.post("/add", upload.single("photo"), async (req, res) => {
  try {
    const photoUrl = req.file?.path || null; // Cloudinary URL
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
        photoUrl, // save Cloudinary URL
        status
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("ADD STAFF ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* ================= UPDATE STAFF ================= */
router.post("/update/:id", upload.single("photo"), async (req, res) => {
  try {
    const id = req.params.id;
    let photoUrl = req.body.old_photo || null;

    if (req.file) {
      photoUrl = req.file.path; // new Cloudinary URL
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
        photoUrl,
        status,
        id
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("UPDATE STAFF ERROR:", err);
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
    console.error("LIST STAFF ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* ================= DELETE STAFF ================= */
router.delete("/delete/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM staff_master WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE STAFF ERROR:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
