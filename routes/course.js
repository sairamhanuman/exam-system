const express = require("express");
const router = express.Router();
const db = require("../config/db");
const XLSX = require("xlsx");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
// =====================
// EXAM & ELECTIVE MAPS
// =====================
const EXAM_TYPE_MAP = {
  "0": "Theory",
  "1": "Practical",
  "2": "Project",
  "3": "Drawing"
};

const ELECTIVE_MAP = {
  "0": "Yes",
  "1": "No"
};

const REPLACEMENT_MAP = {
  "0": "Yes",
  "1": "No"
};

/* ADD */
router.post("/add", async (req, res) => {
  await db.query(
    `INSERT INTO course_master
    (programme_id, branch_id, semester_id, regulation_id,
     course_code, course_name, course_short, exam_type, elective, elective_name,
     replacement, credits, ta, internal_marks, external_marks)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    Object.values(req.body)
  );
  res.json({ success: true });
});

/* LIST */
router.get("/list", async (req, res) => {
  try {
    const { programme_id, branch_id, semester_id, regulation_id } = req.query;

    const [rows] = await db.query(
      `SELECT * FROM course_master
       WHERE status=1
       AND programme_id=?
       AND branch_id=?
       AND semester_id=?
       AND regulation_id=?
       ORDER BY course_code`,
      [programme_id, branch_id, semester_id, regulation_id]
    );

    res.json(rows);
  } catch (err) {
    res.json([]);
  }
});


/* UPDATE */
router.put("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await db.query(
      `UPDATE course_master SET
        course_name=?,
        course_short=?,
        exam_type=?,
        elective=?,
        elective_name=?,
        replacement=?,
        credits=?,
        ta=?,
        internal_marks=?,
        external_marks=?
       WHERE id=?`,
      [
        req.body.course_name,
        req.body.course_short,
        req.body.exam_type,
        req.body.elective,
        req.body.elective_name,
        req.body.replacement,
        req.body.credits,
        req.body.ta,
        req.body.internal_marks,
        req.body.external_marks,
        id
      ]
    );

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});


/* ======================
   SOFT DELETE COURSE
====================== */
router.delete("/delete/:id", async (req, res) => {
  try {
    await db.query(
      "UPDATE course_master SET status=0 WHERE id=?",
      [req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// ===============================
// GENERATE COURSE EXCEL TEMPLATE
// ===============================
router.get("/generate-excel", async (req, res) => {
  try {
    const { programme_id, branch_id, semester_id, regulation_id } = req.query;

    if (!programme_id || !branch_id || !semester_id || !regulation_id) {
      return res.status(400).json({ message: "Missing dropdown values" });
    }

    // Excel header (ORDER MATTERS)
    const data = [
      [
        "Course Code",
        "Course Name",
        "Course Short",
        "Exam Type",
        "Elective (Yes/No)",
        "Elective Name",
        "Replacement (Yes/No)",
          "Credits",
        "TA",
        "Internal Marks",
        "External Marks",
        "Order No"
      ]
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Courses");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=course_template.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Excel generation failed" });
  }
});

// ===============================
// UPLOAD COURSE EXCEL
// ===============================
// =======================================
// UPLOAD COURSE EXCEL
// =======================================
router.post("/upload-excel", upload.single("file"), async (req, res) => {
  const { programme_id, branch_id, semester_id, regulation_id } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);

    let inserted = 0;
    let skipped = 0;

    for (const row of rows) {
      const {
        "Course Code": course_code,
        "Course Name": course_name,
        "Course Short": course_short,
       

        "Elective Name": elective_name,
        "Credits": credits,
        "TA": ta,
        "Internal Marks": internal_marks,
        "External Marks": external_marks,
        "Order No": order_no
      } = row;

      // =====================
// VALIDATE & MAP VALUES
// =====================
const examRaw = String(row["Exam Type"]).trim();
const electiveRaw = String(row["Elective (Yes/No)"]).trim();
const replacementRaw = String(row["Replacement (Yes/No)"]).trim();

if (!EXAM_TYPE_MAP.hasOwnProperty(examRaw)) {
  return res.status(400).json({
    message: `❌ Invalid Exam Type '${examRaw}'. Use:
0-Theory, 1-Practical, 2-Project, 3-Drawing`
  });
}

if (!ELECTIVE_MAP.hasOwnProperty(electiveRaw)) {
  return res.status(400).json({
    message: `❌ Invalid Elective '${electiveRaw}'. Use:
0-Yes, 1-No`
  });
}

if (!REPLACEMENT_MAP.hasOwnProperty(replacementRaw)) {
  return res.status(400).json({
    message: `❌ Invalid Elective '${replacementRaw}'. Use:
0-Yes, 1-No`
  });
}

const exam_type = EXAM_TYPE_MAP[examRaw];
const elective = ELECTIVE_MAP[electiveRaw];
const replacement = REPLACEMENT_MAP[replacementRaw];

      // DUPLICATE CHECK
      const [exists] = await db.query(
        `SELECT id FROM course_master
         WHERE programme_id=? AND branch_id=? AND semester_id=?
         AND regulation_id=? AND course_code=?`,
        [programme_id, branch_id, semester_id, regulation_id, course_code]
      );

      if (exists.length > 0) {
        skipped++;
        continue;
      }

      await db.query(
        `INSERT INTO course_master
        (programme_id, branch_id, semester_id, regulation_id,
         course_code, course_name, course_short, exam_type,
         elective, elective_name,replacement, credits, ta,
         internal_marks, external_marks, order_no)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          programme_id,
          branch_id,
          semester_id,
          regulation_id,
          course_code,
          course_name,
          course_short,
          exam_type,
          elective,
          elective_name,
          replacement,
          credits || 0,
          ta || 0,
          internal_marks || 0,
          external_marks || 0,
          order_no || 0
        ]
      );

      inserted++;
    }

    // FINAL MESSAGE
    let message = "✅ Upload completed. ";
    if (inserted > 0) message += `${inserted} new courses added. `;
    if (skipped > 0) message += `${skipped} already existed (skipped).`;

    res.json({ message });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Excel upload failed" });
  }
});


module.exports = router;
