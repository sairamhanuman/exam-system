// Variables
let filterData = [];
let courseData = [];
let editId = null;

// Initialize the course mapping functionality
async function initCourseMapping() {
  await loadFilters(); // Load filters and populate dropdowns
  await loadExtras();  // Load additional data (batches, sections, faculties)
}

// Load filter data from the API
async function loadFilters() {
  try {
    const res = await fetch("/api/course-mapping/filters");
    const data = await res.json();

    if (!data.filters || !data.courses) {
      console.error("API Response is missing required keys: filters or courses", data);
      return;
    }

    filterData = data.filters;
    courseData = data.courses;

    console.log("✅ Filter Data Loaded:", filterData);
    console.log("✅ Course Data Loaded:", courseData);

    loadProgrammes(); // Trigger loading of Programmes (first dropdown)
  } catch (error) {
    console.error("Error loading filters:", error);
  }
}

// Populate Programme Dropdown
function loadProgrammes() {
  const programmeSelect = document.getElementById("programme");

  if (!programmeSelect) {
    console.error("Programme dropdown not found in DOM.");
    return;
  }

  programmeSelect.innerHTML = `<option value="">Select Programme</option>`;

  const programmes = [...new Map(
    filterData.map(f => [f.programme_id, f.programme_name])
  )];

  programmes.forEach(([id, name]) => {
    programmeSelect.innerHTML += `<option value="${id}">${name}</option>`;
  });

  console.log("Programme dropdown options loaded:", programmeSelect.innerHTML);
}

// Populate Branch Dropdown
function loadBranches() {
  const programmeId = document.getElementById("programme")?.value;
  const branchSelect = document.getElementById("branch");

  if (!programmeId) {
    console.error("No programme selected. Cannot load branches.");
    return;
  }

  branchSelect.innerHTML = `<option value="">Select Branch</option>`;

  const branches = filterData.filter(f => f.programme_id == programmeId);
  const uniqueBranches = [...new Map(
    branches.map(b => [b.branch_id, b.branch_name])
  )];

  uniqueBranches.forEach(([id, name]) => {
    branchSelect.innerHTML += `<option value="${id}">${name}</option>`;
  });

  console.log("Branch dropdown options loaded:", branchSelect.innerHTML);
}

// Populate Semester Dropdown
function loadSemesters() {
  const programmeId = document.getElementById("programme")?.value;
  const branchId = document.getElementById("branch")?.value;
  const semesterSelect = document.getElementById("semester");

  if (!programmeId || !branchId) {
    console.error("Programme or Branch is not selected yet.");
    return;
  }

  semesterSelect.innerHTML = `<option value="">Select Semester</option>`;

  const semesters = filterData.filter(f =>
    f.programme_id == programmeId &&
    f.branch_id == branchId
  );

  const uniqueSemesters = [...new Map(
    semesters.map(s => [s.semester_id, s.semester_name])
  )];

  uniqueSemesters.forEach(([id, name]) => {
    semesterSelect.innerHTML += `<option value="${id}">${name}</option>`;
  });

  console.log("Semester dropdown options loaded:", semesterSelect.innerHTML);
}

// Populate Regulation Dropdown
function loadRegulations() {
  const semesterId = document.getElementById("semester")?.value;
  const regulationSelect = document.getElementById("regulation");

  if (!semesterId) {
    console.error("No semester selected. Cannot load regulations.");
    return;
  }

  regulationSelect.innerHTML = '<option value="">Select Regulation</option>';

  const regs = filterData
    .filter(r => r.semester_id == semesterId)
    .map(r => ({ id: r.regulation_id, name: r.regulation_name }));

  const uniqueRegulations = [...new Map(regs.map(r => [r.id, r])).values()];

  uniqueRegulations.forEach(r => {
    regulationSelect.innerHTML += `<option value="${r.id}">${r.name}</option>`;
  });

  console.log("Regulation dropdown options loaded:", regulationSelect.innerHTML);
}

// Populate Course Dropdown
function loadCourses() {
  const programmeId = document.getElementById("programme")?.value;
  const branchId = document.getElementById("branch")?.value;
  const semesterId = document.getElementById("semester")?.value;
  const regulationId = document.getElementById("regulation")?.value;

  const courseSelect = document.getElementById("course");

  if (!programmeId || !branchId || !semesterId || !regulationId) {
    console.error("Missing one or more dropdown selections.");
    return;
  }

  courseSelect.innerHTML = `<option value="">Select Course</option>`;

  const filteredCourses = courseData.filter(c =>
    c.programme_id == programmeId &&
    c.branch_id == branchId &&
    c.semester_id == semesterId &&
    c.regulation_id == regulationId
  );

  filteredCourses.forEach(c => {
    courseSelect.innerHTML += `
      <option value="${c.id}">
        ${c.course_code} - ${c.course_name}
      </option>`;
  });

  console.log("Course dropdown options loaded:", courseSelect.innerHTML);
}

// Load Additional Data (e.g., Batch, Section, Faculty)
async function loadExtras() {
  const res = await fetch("/api/course-mapping/extras");
  const data = await res.json();

  fill("cm_batch", data.batches, "batch_name");
  fill("cm_section", data.sections, "section_name");
  fill("cm_faculty", data.staff, "staff_name");

  console.log("✅ Extras loaded:", data);
}

function fill(id, arr, label) {
  const el = document.getElementById(id);
  if (!el) {
    console.error(`Element with ID '${id}' not found.`);
    return;
  }

  el.innerHTML = `<option value="">Select</option>`;
  arr.forEach(x => {
    el.innerHTML += `<option value="${x.id}">${x[label]}</option>`;
  });

  console.log(`Dropdown '${id}' options loaded:`, el.innerHTML);
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  initCourseMapping();
  loadExtras();
});

async function saveMapping() {
  const payload = {
    batch_id: cm_batch.value,
    section_id: cm_section.value,
    staff_id: cm_faculty.value
  };

  let url = "/api/course-mapping/save";
  let method = "POST";

  if (editId) {
    url = `/api/course-mapping/update/${editId}`;
    method = "PUT";
  } else {
    Object.assign(payload, {
      programme_id: programme.value,
      branch_id: branch.value,
      semester_id: semester.value,
      regulation_id: regulation.value,
      course_id: course.value
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

async function loadMappingTable() {
  const params = new URLSearchParams({
    programme_id: programme.value,
    branch_id: branch.value,
    semester_id: semester.value,
    regulation_id: regulation.value
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
document.addEventListener("DOMContentLoaded", () => {
  initCourseMapping();
  loadExtras();
});


let editId = null;

async function editMapping(id) {
  const res = await fetch(`/api/course-mapping/get/${id}`);
  const data = await res.json();

  editId = id;

  // Only editable fields
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
