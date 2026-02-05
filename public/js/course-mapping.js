let filterData = [];
let courseData = [];
let editId = null;

async function initCourseMapping() {
  await loadFilters();
  await loadExtras();
}

async function loadFilters() {
  const res = await fetch("/api/course-mapping/filters");
  const data = await res.json();

  filterData = data.filters;
  courseData = data.courses;

  loadProgrammes();
}

function loadProgrammes() {
  const programmeSelect = document.getElementById("courseprogramme");
  programmeSelect.innerHTML = `<option value="">Select Programme</option>`;

  const programmes = [...new Map(
    filterData.map(f => [f.programme_id, f.programme_name])
  )];

  programmes.forEach(([id, name]) => {
    programmeSelect.innerHTML += `<option value="${id}">${name}</option>`;
  });
}

function loadBranches() {
  const programmeId = document.getElementById("courseprogramme").value;
  const branchSelect = document.getElementById("coursebranch");

  branchSelect.innerHTML = `<option value="">Select Branch</option>`;

  const branches = filterData.filter(
    f => f.programme_id == programmeId
  );

  const uniqueBranches = [...new Map(
    branches.map(b => [b.branch_id, b.branch_name])
  )];

  uniqueBranches.forEach(([id, name]) => {
    branchSelect.innerHTML += `<option value="${id}">${name}</option>`;
  });
}

function loadSemesters() {
  const programmeId = document.getElementById("courseprogramme").value;
  const branchId = document.getElementById("coursebranch").value;
  const semesterSelect = document.getElementById("coursesemester");

  semesterSelect.innerHTML = `<option value="">Select Semester</option>`;

  if (!programmeId || !branchId) {
    console.warn("Cannot load semesters without Programme and Branch selection.");
    return;
  }

  const semesters = filterData.filter(f =>
    f.programme_id == programmeId && f.branch_id == branchId
  );

  if (semesters.length === 0) {
    console.warn("No semesters found for the selected Programme and Branch.");
    return;
  }

  const uniqueSem = [...new Map(
    semesters.map(s => [s.semester_id, s.semester_name])
  )];

  uniqueSem.forEach(([id, name]) => {
    semesterSelect.innerHTML += `<option value="${id}">${name}</option>`;
  });
}

function loadRegulations() {
  const regulationSelect = document.getElementById("courseregulation");
  if (!regulationSelect) return;

  regulationSelect.innerHTML = '<option value="">Select Regulation</option>';

  const semesterId = document.getElementById("coursesemester").value;

  const regs = filterData
    .filter(r => r.semester_id == semesterId)
    .map(r => ({
      id: r.regulation_id,
      name: r.regulation_name
    }));

  const unique = [...new Map(regs.map(r => [r.id, r])).values()];

  unique.forEach(r => {
    regulationSelect.innerHTML +=
      `<option value="${r.id}">${r.name}</option>`;
  });
}

function loadCourses() {
  const programmeId = document.getElementById("courseprogramme").value;
  const branchId = document.getElementById("coursebranch").value;
  const semesterId = document.getElementById("coursesemester").value;
  const regulationId = document.getElementById("courseregulation").value;
  const courseSelect = document.getElementById("mappingcourse");

  courseSelect.innerHTML = `<option value="">Select Course</option>`;

  if (!programmeId || !branchId || !semesterId || !regulationId) {
    console.warn("All dropdowns are required to load courses.");
    return;
  }

  const filtered = courseData.filter(c =>
    c.programme_id == programmeId &&
    c.branch_id == branchId &&
    c.semester_id == semesterId &&
    c.regulation_id == regulationId
  );

  if (filtered.length === 0) {
    console.warn("No courses found for the selected filters.");
    return;
  }

  filtered.forEach(c => {
    courseSelect.innerHTML += `
      <option value="${c.id}">
        ${c.course_code} - ${c.course_name}
      </option>
    `;
  });
}

async function loadExtras() {
  const res = await fetch("/api/course-mapping/extras");
  const data = await res.json();

  fill("cm_batch", data.batches, "batch_name");
  fill("cm_section", data.sections, "section_name");
  fill("cm_faculty", data.staff, "staff_name");
}

function fill(id, arr, label) {
  const el = document.getElementById(id);
  el.innerHTML = `<option value="">Select</option>`;
  arr.forEach(x => {
    el.innerHTML += `<option value="${x.id}">${x[label]}</option>`;
  });
}

function reinitializeDropdownListeners() {
  const programme = document.getElementById("courseprogramme");
  if (programme) {
    programme.onchange = loadBranches;
  }

  const branch = document.getElementById("coursebranch");
  if (branch) {
    branch.onchange = loadSemesters;
  }

  const semester = document.getElementById("coursesemester");
  if (semester) {
    semester.onchange = loadRegulations;
  }

  const regulation = document.getElementById("courseregulation");
  if (regulation) {
    regulation.onchange = loadCourses;
  }

  console.log("✅ Dropdown event listeners reinitialized.");
}

document.addEventListener("DOMContentLoaded", () => {
  initCourseMapping();
  reinitializeDropdownListeners();
});

// ✅ FIXED: saveMapping with correct IDs
async function saveMapping() {
  const payload = {
    batch_id: document.getElementById("cm_batch").value,
    section_id: document.getElementById("cm_section").value,
    staff_id: document.getElementById("cm_faculty").value
  };

  let url = "/api/course-mapping/save";
  let method = "POST";

  if (editId) {
    url = `/api/course-mapping/update/${editId}`;
    method = "PUT";
  } else {
    Object.assign(payload, {
      programme_id: document.getElementById("courseprogramme").value,
      branch_id: document.getElementById("coursebranch").value,
      semester_id: document.getElementById("coursesemester").value,
      regulation_id: document.getElementById("courseregulation").value,
      course_id: document.getElementById("mappingcourse").value
    });
  }

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const out = await res.json();
  alert(out.message);

  editId = null;
  document.getElementById("saveBtn").innerText = "Save";

  loadMappingTable();
}

// ✅ FIXED: loadMappingTable with correct IDs
async function loadMappingTable() {
  const params = new URLSearchParams({
    programme_id: document.getElementById("courseprogramme").value,
    branch_id: document.getElementById("coursebranch").value,
    semester_id: document.getElementById("coursesemester").value,
    regulation_id: document.getElementById("courseregulation").value
  });

  const res = await fetch(`/api/course-mapping/list?${params}`);
  const data = await res.json();

  const tbody = document.querySelector("#mappingTable tbody");
  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">No mappings found</td></tr>`;
    return;
  }

  data.forEach(row => {
    tbody.innerHTML += `
      <tr>
        <td>${row.course_code}</td>
        <td>${row.course_name}</td>
        <td>${row.batch_name}</td>
        <td>${row.section_name}</td>
        <td>${row.faculty_name}</td>
        <td>
          <button onclick="editMapping(${row.id})">✏️</button>
          <button onclick="deleteMapping(${row.id})">❌</button>
        </td>
      </tr>
    `;
  });
}

async function editMapping(id) {
  const res = await fetch(`/api/course-mapping/get/${id}`);
  const data = await res.json();

  editId = id;

  document.getElementById("cm_batch").value = data.batch_id;
  document.getElementById("cm_section").value = data.section_id;
  document.getElementById("cm_faculty").value = data.staff_id;

  document.getElementById("saveBtn").innerText = "Update Mapping";
}

async function deleteMapping(id) {
  if (!confirm("Are you sure you want to delete this mapping?")) return;

  const res = await fetch(`/api/course-mapping/delete/${id}`, {
    method: "DELETE"
  });

  const out = await res.json();
  alert(out.message);

  loadMappingTable();
}