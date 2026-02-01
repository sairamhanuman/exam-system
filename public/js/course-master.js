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
   DOWNLOAD TEMPLATE
===================== */
function downloadExcel() {
  window.location =
    "/api/course/generate-excel?programme=B.Tech&branch=CSE&semester=1&regulation=R18";
}

document.getElementById("uploadForm").onsubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  formData.append("programme_id", 1);
  formData.append("branch_id", 1);
  formData.append("semester_id", 1);
  formData.append("regulation_id", 1);

  const res = await fetch("/api/course/upload-excel", {
    method: "POST",
    body: formData
  });

  alert((await res.json()).message);
};

/* =====================
   UPLOAD EXCEL
===================== */
function uploadCourseExcel() {
  const file = document.getElementById("courseExcel").files[0];
  if (!file) {
    alert("Select Excel file");
    return;
  }

  const fd = new FormData();
  fd.append("file", file);
  fd.append("programme_id", courseProgramme.value);
  fd.append("branch_id", courseBranch.value);
  fd.append("semester_id", courseSemester.value);
  fd.append("regulation_id", courseRegulation.value);

  fetch("/api/course/import", {
    method: "POST",
    body: fd
  })
  .then(res => res.json())
  .then(d => {
    alert(
      `Import Completed\nInserted: ${d.inserted}\nSkipped (duplicates): ${d.skipped}`
    );
    document.getElementById("btnCourseShow").click();
  });
}
