const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* ============================
   ADD STUDENT
============================ */
router.post("/add", async (req, res) => {
  try {
    const {
      batch,
      programme,
      branch,
      semester,
      regulation,

      htno,
      admno,

      student_name,
      father_name,
      mother_name,

      age,
      sex,
      dob,

      aadhar_no,
      student_mobile,
      parent_mobile,

      doj,
      section
    } = req.body;

    const sql = `
      INSERT INTO students (
        batch, programme, branch, semester, regulation,
        htno, admno,
        student_name, father_name, mother_name,
        age, sex, dob,
        aadhar_no,
        student_mobile, parent_mobile,
        doj, section
      )
      VALUES (?,?,?,?,?,
              ?,?,
              ?,?,?,
              ?,?,?,
              ?,
              ?,?,
              ?,?)
    `;

    await db.query(sql, [
      batch, programme, branch, semester, regulation,
      htno, admno,
      student_name, father_name, mother_name,
      age, sex, dob,
      aadhar_no,
      student_mobile, parent_mobile,
      doj, section
    ]);

    res.json({
      success: true,
      message: "Student saved successfully"
    });

  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.json({
        success: false,
        message: "Hall Ticket already exists"
      });
    }

    console.error(err);
    res.json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
