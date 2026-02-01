
function openCourseMaster() {
  hideAllScreens();                 // you already have this function
  document.getElementById("course").style.display = "block";

  // Load dropdowns when screen opens
  loadCourseDropdown("courseProgramme", "/api/programme/list", "Programme");
  loadCourseDropdown("courseSemester", "/api/semester/list", "Semester");
  loadCourseDropdown("courseRegulation", "/api/regulation/list", "Curriculum");
}

const API = "/api";

/* ===============================
   OPEN COURSE MASTER SCREEN
================================ */
function openCourseMaster() {
  hideAllScreens();
  document.getElementById("course").style.display = "block";

  fillSelect("courseProgramme", "/api/programme/list", "programme_name");
  fillSelect("courseSemester", "/api/semester/list", "semester_name");
  fillSelect("courseRegulation", "/api/regulation/list", "regulation_name");

  document.getElementById("courseProgramme").value = "";
  document.getElementById("courseBranch").innerHTML = `<option value="">Branch</option>`;
}

/* ===============================
   FILL DROPDOWN
================================ */
async function fillSelect(id, url, textKey) {
  const res = await fetch(url);
  const data = await res.json();
  const sel = document.getElementById(id);

  sel.innerHTML = `<option value="">Select</option>`;
  data.forEach(d => {
    sel.innerHTML += `<option value="${d.id}">${d[textKey]}</option>`;
  });
}

/* ===============================
   LOAD BRANCH ON PROGRAMME CHANGE
================================ */
document.getElementById("courseProgramme").addEventListener("change", async e => {
  const res = await fetch("/api/branch/list");
  const data = await res.json();

  const branch = document.getElementById("courseBranch");
  branch.innerHTML = `<option value="">Branch</option>`;

  data
    .filter(b => b.programme_id == e.target.value)
    .forEach(b => {
      branch.innerHTML += `<option value="${b.id}">${b.branch_name}</option>`;
    });
});

/* ===============================
   SHOW COURSES
================================ */
document.getElementById("btnCourseShow").onclick = async () => {
  const p = courseProgramme.value;
  const b = courseBranch.value;
  const s = courseSemester.value;
  const r = courseRegulation.value;

  const res = await fetch(
    `/api/course/list?programme_id=${p}&branch_id=${b}&semester_id=${s}&regulation_id=${r}`
  );
  const data = await res.json();

  const tbody = document.querySelector("#courseTable tbody");
  tbody.innerHTML = "";

  data.forEach(c => {
    tbody.innerHTML += `
      <tr>
        <td>${c.course_code}</td>
        <td>${c.course_name}</td>
        <td>${c.exam_type}</td>
        <td>${c.credits}</td>
        <td>${c.internal_marks}</td>
        <td>${c.external_marks}</td>
      </tr>
    `;
  });
};
