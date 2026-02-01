
function openCourseMaster() {
  hideAllScreens();                 // you already have this function
  document.getElementById("course").style.display = "block";

  // Load dropdowns when screen opens
  loadCourseDropdown("courseProgramme", "/api/programme/list", "Programme");
  loadCourseDropdown("courseSemester", "/api/semester/list", "Semester");
  loadCourseDropdown("courseRegulation", "/api/regulation/list", "Curriculum");
}


const API = "/api";

async function fillSelect(id, url, textKey) {
  const res = await fetch(url);
  const data = await res.json();
  const sel = document.getElementById(id);
  sel.innerHTML = `<option value="">Select</option>`;
  data.forEach(d => {
    sel.innerHTML += `<option value="${d.id}">${d[textKey]}</option>`;
  });
}

document.getElementById("programme").addEventListener("change", async e => {
  const res = await fetch("/api/branch/list");
  const data = await res.json();
  const branch = document.getElementById("branch");
  branch.innerHTML = `<option value="">Branch</option>`;
  data.filter(b => b.programme_id == e.target.value)
      .forEach(b => branch.innerHTML += `<option value="${b.id}">${b.branch_name}</option>`);
});

document.getElementById("btnShow").onclick = async () => {
  const p = programme.value;
  const b = branch.value;
  const s = semester.value;
  const r = regulation.value;

  const res = await fetch(`/api/course/list?programme_id=${p}&branch_id=${b}&semester_id=${s}&regulation_id=${r}`);
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
      </tr>`;
  });
};

document.addEventListener("DOMContentLoaded", () => {
  fillSelect("programme", "/api/programme/list", "programme_name");
  fillSelect("semester", "/api/semester/list", "semester_name");
  fillSelect("regulation", "/api/regulation/list", "regulation_name");
});
