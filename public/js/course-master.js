const API = "/api/course";

/* =====================
   OPEN COURSE MASTER
===================== */
function openCourseMaster() {
  hideAllScreens();
  document.getElementById("course").style.display = "block";

  fillSelect("courseProgramme", "/api/programme/list", "programme_name");
  fillSelect("courseSemester", "/api/semester/list", "semester_name");
  fillSelect("courseRegulation", "/api/regulation/list", "regulation_name");
}

/* =====================
   DROPDOWNS
===================== */
async function fillSelect(id, url, key) {
  const res = await fetch(url);
  const data = await res.json();
  const sel = document.getElementById(id);
  sel.innerHTML = `<option value="">Select</option>`;
  data.forEach(d => {
    sel.innerHTML += `<option value="${d.id}">${d[key]}</option>`;
  });
}

document.getElementById("courseProgramme").addEventListener("change", async e => {
  const res = await fetch("/api/branch/list");
  const data = await res.json();
  const branch = document.getElementById("courseBranch");
  branch.innerHTML = `<option value="">Branch</option>`;
  data.filter(b => b.programme_id == e.target.value)
      .forEach(b => branch.innerHTML += `<option value="${b.id}">${b.branch_name}</option>`);
});

/* =====================
   SHOW COURSES
===================== */
document.getElementById("btnCourseShow").onclick = async () => {

  const q = `?programme_id=${courseProgramme.value}
             &branch_id=${courseBranch.value}
             &semester_id=${courseSemester.value}
             &regulation_id=${courseRegulation.value}`;

  const res = await fetch(API + "/list" + q);
  const data = await res.json();

  const tbody = document.querySelector("#courseTable tbody");
  tbody.innerHTML = "";

  data.forEach((c, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${c.course_code}</td>
        <td>${c.course_name}</td>
        <td>${c.course_short}</td>        
        <td>${c.exam_type}</td>
        <td>${c.credits}</td>
        <td>${c.internal_marks}</td>
        <td>${c.external_marks}</td>
        <td>
           <button class="btn btn-edit" onclick='editCourse(${JSON.stringify(c)})'>Edit</button>
          <button class="btn btn-delete" onclick='deleteCourse(${c.id})'>Delete</button>
        </td>
      </tr>`;
  });
};

/* =====================
   NEW
===================== */
document.getElementById("btnCourseNew").onclick = () => {
  document.querySelectorAll(".entry-box input").forEach(i => i.value = "");
  document.getElementById("courseId").value = "";
};

/* =====================
   SAVE
===================== */

document.getElementById("btnCourseSave").onclick = async () => {

  const payload = {
    programme_id: courseProgramme.value,
    branch_id: courseBranch.value,
    semester_id: courseSemester.value,
    regulation_id: courseRegulation.value,

    course_code: course_code.value,
    course_name: course_name.value,
    course_short:course_short.value,
    exam_type: exam_type.value,
    elective: elective.value,
    elective_name: elective_name.value,
    replacement: replacement.value,
    credits: credits.value,
    ta: ta.value,
    internal_marks: internal_marks.value,
    external_marks: external_marks.value
  };

  const id = document.getElementById("courseId").value;

  let url = "/api/course/add";
  let method = "POST";

  // 🔥 EDIT MODE
  if (id) {
    url = `/api/course/update/${id}`;
    method = "PUT";
  }

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const result = await res.json();

  if (!result.success) {
    alert(result.message || "Save failed");
    return;
  }

  document.getElementById("btnCourseShow").click();
};

/* =====================
   EDIT
===================== */

function editCourse(c) {
  courseId.value = c.id;

  course_code.value = c.course_code;
  course_name.value = c.course_name;
  course_short.value=c.course_short;
  exam_type.value = c.exam_type;
  elective.value = c.elective;
  elective_name.value = c.elective_name;
  replacement.value = c.replacement;
  credits.value = c.credits;
  ta.value = c.ta;
  internal_marks.value = c.internal_marks;
  external_marks.value = c.external_marks;
}

/* =====================
Soft delete
===================== */

async function deleteCourse(id) {
  if (!confirm("Are you sure you want to delete this course?")) return;

  const res = await fetch(`/api/course/delete/${id}`, {
    method: "DELETE"
  });

  const result = await res.json();

  if (!result.success) {
    alert(result.message || "Delete failed");
    return;
  }

  // reload table
  document.getElementById("btnCourseShow").click();
}


/* =====================
   GEnerate excel
===================== */


function generateCourseExcel() {
  const programmeId = document.getElementById("courseProgramme").value;
  const branchId = document.getElementById("courseBranch").value;
  const semesterId = document.getElementById("courseSemester").value;
  const regulationId = document.getElementById("courseRegulation").value;

  if (!programmeId || !branchId || !semesterId || !regulationId) {
    alert("Please select Programme, Branch, Semester and Regulation");
    return;
  }

  const url =
    `/api/course/generate-excel` +
    `?programme_id=${programmeId}` +
    `&branch_id=${branchId}` +
    `&semester_id=${semesterId}` +
    `&regulation_id=${regulationId}`;

  window.location.href = url;
}


/* =====================
Upload excel
===================== */

function uploadCourseExcel() {

  const fileInput = document.getElementById("courseExcelFile");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select an Excel file");
    return;
  }

  // Dropdown values (VERY IMPORTANT)
  const programme_id  = document.getElementById("courseProgramme").value;
  const branch_id     = document.getElementById("courseBranch").value;
  const semester_id   = document.getElementById("courseSemester").value;
  const regulation_id = document.getElementById("courseRegulation").value;

  if (!programme_id || !branch_id || !semester_id || !regulation_id) {
    alert("Please select Programme, Branch, Semester and Regulation");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("programme_id", programme_id);
  formData.append("branch_id", branch_id);
  formData.append("semester_id", semester_id);
  formData.append("regulation_id", regulation_id);

  fetch("/api/course/upload-excel", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("✅ Courses uploaded successfully");
      loadCourses(); // refresh table if exists
    } else {
      alert("❌ " + data.message);
    }
  })
  .catch(err => {
    console.error(err);
    alert("Upload failed");
  });
}
