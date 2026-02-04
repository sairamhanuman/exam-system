let filterData = [];
let courseData = [];
let editId = null; // Declare globally only once

async function initCourseMapping() {
  await loadFilters();
  await loadExtras();
}

async function loadFilters() {
  try {
    const res = await fetch("/api/course-mapping/filters");
    const data = await res.json();

    if (!data.filters || !data.courses)
      throw new Error("API response is missing filters or courses data.");

    filterData = data.filters;
    courseData = data.courses;

    console.log("✅ Filter Data Loaded:", filterData);
    console.log("✅ Course Data Loaded:", courseData);

    loadProgrammes();
  } catch (error) {
    console.error("Error loading filters:", error);
  }
}

function loadProgrammes() {
  const programmeSelect = document.getElementById("programme");

  if (!programmeSelect) {
    console.error("Programme dropdown not found in the DOM.");
    return;
  }

  programmeSelect.innerHTML = `<option value="">Select Programme</option>`;

  const programmes = [...new Map(
    filterData.map(f => [f.programme_id, f.programme_name])
  )];

  programmes.forEach(([id, name]) => {
    programmeSelect.innerHTML += `<option value="${id}">${name}</option>`;
  });

  console.log("✅ Programme dropdown options loaded:", programmeSelect.innerHTML);
}

function loadBranches() {
  const programmeId = document.getElementById("programme")?.value;
  const branchSelect = document.getElementById("branch");

  if (!programmeId) {
    console.warn("No programme selected. Cannot load branches.");
    branchSelect.innerHTML = `<option value="">Select Branch</option>`;
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

  console.log("✅ Branch dropdown options loaded:", branchSelect.innerHTML);
}

function reinitializeDropdownListeners() {
  const programme = document.getElementById("programme");
  if (programme) {
    programme.addEventListener("change", loadBranches);
  } else {
    console.error("Programme dropdown not found.");
  }

  const branch = document.getElementById("branch");
  if (branch) {
    branch.addEventListener("change", loadSemesters);
  } else {
    console.error("Branch dropdown not found.");
  }

  const semester = document.getElementById("semester");
  if (semester) {
    semester.addEventListener("change", loadRegulations);
  } else {
    console.error("Semester dropdown not found.");
  }

  const regulation = document.getElementById("regulation");
  if (regulation) {
    regulation.addEventListener("change", loadCourses);
  } else {
    console.error("Regulation dropdown not found.");
  }

  console.log("✅ Dropdown event listeners reinitialized.");
}
function loadSemesters() {
  const programmeId = document.getElementById("programme").value;
  const branchId = document.getElementById("branch").value;

  if (!programmeId || !branchId) return; // Guard for missing selections

  const semesterSelect = document.getElementById("semester");
  semesterSelect.innerHTML = `<option value="">Select Semester</option>`;

  const semesters = filterData.filter(f =>
    f.programme_id == programmeId &&
    f.branch_id == branchId
  );

  const uniqueSem = [...new Map(
    semesters.map(s => [s.semester_id, s.semester_name])
  )];

  uniqueSem.forEach(([id, name]) => {
    semesterSelect.innerHTML += `<option value="${id}">${name}</option>`;
  });
}


document.addEventListener("DOMContentLoaded", initCourseMapping);

function loadRegulations() {
  const regulationSelect = document.getElementById("regulation");
  if (!regulationSelect) return; // 🛡️ safety

  regulationSelect.innerHTML = '<option value="">Select Regulation</option>';

  const semesterId = document.getElementById("semester").value;

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
  course.innerHTML = `<option value="">Select Course</option>`;

  const filtered = courseData.filter(c =>
    c.programme_id == programme.value &&
    c.branch_id == branch.value &&
    c.semester_id == semester.value &&
    c.regulation_id == regulation.value
  );

  filtered.forEach(c => {
    course.innerHTML += `
      <option value="${c.id}">
        ${c.course_code} - ${c.course_name}
      </option>`;
  });
}

async function loadExtras() {
  try {
    const res = await fetch("/api/course-mapping/extras");
    const data = await res.json();

    console.log("Filters API full response:", data);

    fill("cm_batch", data.batches, "batch_name");
    fill("cm_section", data.sections, "section_name");
    fill("cm_faculty", data.staff, "staff_name");

    console.log("✅ Extras dropdowns populated.");
  } catch (error) {
    console.error("Error loading extras:", error);
  }
}

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
