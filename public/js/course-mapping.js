let filterData = [];
let courseData = [];

async function initCourseMapping() {
  await loadFilters();
}

async function loadFilters() {
  const res = await fetch("/api/course-mapping/filters");
  const data = await res.json();

  filterData = data.filters;
  courseData = data.courses;

  loadProgrammes();
}


function loadProgrammes() {
  const programmeSelect = document.getElementById("programme");
  programmeSelect.innerHTML = `<option value="">Select Programme</option>`;

  const programmes = [...new Map(
    filterData.map(f => [f.programme_id, f.programme_name])
  )];

  programmes.forEach(([id, name]) => {
    programmeSelect.innerHTML += `<option value="${id}">${name}</option>`;
  });
}
function loadProgrammes() {
  const programmeSelect = document.getElementById("programme");
  programmeSelect.innerHTML = `<option value="">Select Programme</option>`;

  const programmes = [...new Map(
    filterData.map(f => [f.programme_id, f.programme_name])
  )];

  programmes.forEach(([id, name]) => {
    programmeSelect.innerHTML += `<option value="${id}">${name}</option>`;
  });
}
function loadBranches() {
  const programmeId = document.getElementById("programme").value;
  const branchSelect = document.getElementById("branch");

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
  const programmeId = programme.value;
  const branchId = branch.value;
  semester.innerHTML = `<option value="">Select Semester</option>`;

  const semesters = filterData.filter(f =>
    f.programme_id == programmeId &&
    f.branch_id == branchId
  );

  const uniqueSem = [...new Map(
    semesters.map(s => [s.semester_id, s.semester_name])
  )];

  uniqueSem.forEach(([id, name]) => {
    semester.innerHTML += `<option value="${id}">${name}</option>`;
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
