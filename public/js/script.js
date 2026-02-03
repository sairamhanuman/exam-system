function hideAllScreens() {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => (screen.style.display = 'none'));
}

function hideAllScreens() {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => (screen.style.display = 'none'));
}

window.onload = () => {
  hideAllScreens();

  const home = document.getElementById("home");
  if (home) {
    home.style.display = "block";
  } else {
    console.error("❌ home element not found");
  }
};

function openCourseMappingPage() {
  fetch("/course-mapping.html")
    .then(res => res.text())
    .then(html => {
      const container = document.getElementById("rightContent");
      container.innerHTML = html;

      // remove old script if exists
      const old = document.getElementById("courseMappingJS");
      if (old) old.remove();

      // load JS AFTER HTML
      const script = document.createElement("script");
      script.src = "/js/course-mapping.js";
      script.id = "courseMappingJS";

      script.onload = () => {
        // ✅ SAFE PLACE
        loadFilters();   // your existing function
        loadExtras();    // ✅ THIS WILL WORK NOW
      };

      document.body.appendChild(script);
    });
}




function openPreExam() {
  hideAllScreens();
  document.getElementById("preExam").style.display = "block";
}


function goHome() {
  hideAllScreens();
  document.getElementById("home").style.display = "block";
}

function backToPreExam() {
  hideAllScreens();
  document.getElementById("preExam").style.display = "block";
}


function toggleMastersSubmenu() {
  const submenu = document.querySelector('.nav-sub');
  if (submenu.style.display === 'block') {
    submenu.style.display = 'none';
    document.getElementById('mastersToggle').textContent = '▶ Masters';
  } else {
    submenu.style.display = 'block';
    document.getElementById('mastersToggle').textContent = '▼ Masters';
  }
}

function openPage(el, page) {
  // sidebar active highlight
  document.querySelectorAll(".nav-item")
    .forEach(i => i.classList.remove("active"));
  el.classList.add("active");

  // open screens
  if (page === "programme") openProgramme();
  if (page === "branch") openBranch();
  if (page === "semester") openSemester();
  if (page === "regulation") openRegulation();
  if (page === "batch") openBatch();
  if (page === "section") openSection();
  if (page === "students") openStudentManagement();
  if (page === "staff") openStaffMaster();
}

function toggleCourseSubmenu() {
  const menu = document.getElementById("courseMenu");
  const arrow = document.getElementById("courseArrow");

  if (menu.style.display === "block") {
    menu.style.display = "none";
    arrow.textContent = "▶";
  } else {
    menu.style.display = "block";
    arrow.textContent = "▼";
  }
}

/* ================= OPEN PROGRAMME MASTER ================= */
function openProgramme() {
  hideAllScreens();
  document.getElementById("programmeMaster").style.display = "block";
  loadProgrammes();
}

/* ================= SAVE PROGRAMME ================= */
let editProgrammeId = null;
function saveProgramme() {
  const name = document.getElementById("programmeName").value.trim();

  if (!name) {
    alert("Enter programme name");
    return;
  }

  if (editProgrammeId === null) {

    fetch("/api/programme/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ programme_name: name })
    })
    .then(res => res.json())
    .then(() => {
      document.getElementById("programmeName").value = "";
      loadProgrammes();
    });

  } else {

    fetch("/api/programme/update/" + editProgrammeId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ programme_name: name })
    })
    .then(res => res.json())
    .then(() => {
      editProgrammeId = null;
      document.getElementById("programmeName").value = "";
      loadProgrammes();
    });
  }
}


/* ================= LOAD PROGRAMME LIST ================= */
function loadProgrammes() {
  fetch("/api/programme/list")
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#programmeTable tbody");
      tbody.innerHTML = "";

      data.forEach((row, i) => {
        tbody.innerHTML += `
          <tr>
            <td>${i + 1}</td>
            <td>${row.programme_name}</td>
            <td>
              <button class="btn purple"
                onclick="editProgramme(${row.id}, '${row.programme_name}')">
                Edit
              </button>
            </td>
            <td>
              <button class="btn red"
                onclick="deleteProgramme(${row.id})">
                Delete
              </button>
            </td>
          </tr>
        `;
      });
    });
}

/* ================= EDIT PROGRAMME LIST ================= */
function editProgramme(id, name) {
  editProgrammeId = id;
  document.getElementById("programmeName").value = name;
}
/* ================= DELETE PROGRAMME LIST ================= */
function deleteProgramme(id) {

  if (!confirm("Are you sure to permanently delete?")) return;

  fetch(`/api/programme/${id}`, {
    method: "DELETE"
  })
  .then(res => res.json())
  .then(() => {
    loadProgrammes();
  });
}

/* ================= OPEN BRANCH MASTER ================= */
let editBranchId = null;


function openBranch() {
  hideAllScreens();
  document.getElementById("branchMaster").style.display = "block";
  loadProgrammeDropdown();
  loadBranches();
}





function loadProgrammeDropdown() {
  fetch("/api/programme/list")
    .then(res => res.json())
    .then(data => {
      const sel = document.getElementById("branchProgramme");
      sel.innerHTML = "<option value=''>Select Programme</option>";

      data.forEach(p => {
        sel.innerHTML += `
          <option value="${p.id}">
            ${p.programme_name}
          </option>`;
      });
    });
}

function saveBranch() {
  const programme_id =
    document.getElementById("branchProgramme").value;

  const branch_name =
    document.getElementById("branchName").value.trim();

  if (!programme_id || !branch_name) {
    alert("Select programme and enter branch");
    return;
  }

  // ADD
  if (editBranchId === null) {
    fetch("/api/branch/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ programme_id, branch_name })
    })
    .then(res => res.json())
    .then(() => {
      document.getElementById("branchName").value = "";
      loadBranches();
    });

  // UPDATE
  } else {
    fetch("/api/branch/update/" + editBranchId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ programme_id, branch_name })
    })
    .then(res => res.json())
    .then(() => {
      editBranchId = null;
      document.getElementById("branchName").value = "";
      loadBranches();
    });
  }
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



function editBranch(id, programme_id, branch_name) {
  editBranchId = id;

  document.getElementById("branchProgramme").value = programme_id;
  document.getElementById("branchName").value = branch_name;
}

function deleteBranch(id) {
  if (!confirm("Delete this branch?")) return;

  fetch("/api/branch/" + id, {
    method: "DELETE"
  })
  .then(() => loadBranches());
}

/* ================= OPEN SEMESTER MASTER ================= */
let editSemesterId = null;

/* ================= OPEN SEMESTER ================= */
function openSemester() {
  hideAllScreens();
  document.getElementById("semesterMaster").style.display = "block";
  loadSemesters();
}

/* ================= SAVE SEMESTER ================= */
function saveSemester() {

  const semester_name =
    document.getElementById("semesterName").value.trim();

  if (!semester_name) {
    alert("Enter semester");
    return;
  }

  // ADD
  if (editSemesterId === null) {

    fetch("/api/semester/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ semester_name })
    })
    .then(res => res.json())
    .then(() => {
      document.getElementById("semesterName").value = "";
      loadSemesters();
    });

  }

  // UPDATE
  else {

    fetch("/api/semester/update/" + editSemesterId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ semester_name })
    })
    .then(res => res.json())
    .then(() => {
      editSemesterId = null;
      document.getElementById("semesterName").value = "";
      loadSemesters();
    });

  }
}

/* ================= LOAD SEMESTERS ================= */

function loadSemesters() {

  fetch("/api/semester/list")
    .then(res => res.json())
    .then(data => {

      const tbody =
        document.querySelector("#semesterTable tbody");

      tbody.innerHTML = "";

      data.forEach((row, i) => {

        tbody.innerHTML += `
          <tr>
            <td>${i + 1}</td>
            <td>${row.semester_name}</td>

            <td>
              <button class="btn purple"
                onclick="editSemester(${row.id}, '${row.semester_name}')">
                Edit
              </button>
            </td>

            <td>
              <button class="btn red"
                onclick="deleteSemester(${row.id})">
                Delete
              </button>
            </td>
          </tr>
        `;
      });
    });
}

/* ================= EDIT ================= */
function editSemester(id, name) {
  editSemesterId = id;
  document.getElementById("semesterName").value = name;
}

/* ================= DELETE ================= */
function deleteSemester(id) {

  if (!confirm("Delete semester?")) return;

  fetch("/api/semester/delete/" + id, {
    method: "DELETE"
  })
  .then(() => loadSemesters());
}


/* ================= OPEN REGULATION ================= */
let editRegulationId = null;

function openRegulation() {
  hideAllScreens();
  document.getElementById("regulationMaster").style.display = "block";
  loadRegulations();
}

/* ================= SAVE ================= */
function saveRegulation() {

  const regulation_name =
    document.getElementById("regulationName").value.trim();

  if (!regulation_name) {
    alert("Enter regulation");
    return;
  }

  // ADD
  if (editRegulationId === null) {

    fetch("/api/regulation/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ regulation_name })
    })
    .then(res => res.json())
    .then(() => {
      document.getElementById("regulationName").value = "";
      loadRegulations();
    });

  }

  // UPDATE
  else {

    fetch("/api/regulation/update/" + editRegulationId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ regulation_name })
    })
    .then(res => res.json())
    .then(() => {
      editRegulationId = null;
      document.getElementById("regulationName").value = "";
      loadRegulations();
    });
  }
}

/* ================= LOAD ================= */

function loadRegulations() {

  fetch("/api/regulation/list")
    .then(res => res.json())
    .then(data => {

      const tbody =
        document.querySelector("#regulationTable tbody");

      tbody.innerHTML = "";

      data.forEach((row, i) => {

        tbody.innerHTML += `
          <tr>
            <td>${i + 1}</td>
            <td>${row.regulation_name}</td>

            <td>
              <button class="btn purple"
                onclick="editRegulation(${row.id}, '${row.regulation_name}')">
                Edit
              </button>
            </td>

            <td>
              <button class="btn red"
                onclick="deleteRegulation(${row.id})">
                Delete
              </button>
            </td>
          </tr>
        `;
      });
    });
}

/* ================= EDIT ================= */
function editRegulation(id, name) {
  editRegulationId = id;
  document.getElementById("regulationName").value = name;
}

/* ================= DELETE ================= */
function deleteRegulation(id) {

  if (!confirm("Permanently delete regulation?")) return;

  fetch("/api/regulation/delete/" + id, {
    method: "DELETE"
  })
  .then(res => res.json())
  .then(() => loadRegulations());
}




/* ================= OPEN BATCH  ================= */
let editBatchId = null;

function openBatch() {
  hideAllScreens();
  document.getElementById("batchMaster").style.display = "block";
  loadBatches();
}

/* ================= SAVE ================= */
function saveBatch() {

  const batch_name =
    document.getElementById("batchName").value.trim();

  if (!batch_name) {
    alert("Enter batch");
    return;
  }

  // ADD
  if (editBatchId === null) {

    fetch("/api/batch/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batch_name })
    })
    .then(res => res.json())
    .then(() => {
      document.getElementById("batchName").value = "";
      loadBatches();
    });

  }

  // UPDATE
  else {

    fetch("/api/batch/update/" + editBatchId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batch_name })
    })
    .then(res => res.json())
    .then(() => {
      editBatchId = null;
      document.getElementById("batchName").value = "";
      loadBatches();
    });
  }
}

/* ================= LOAD ================= */

function loadBatches() {

  fetch("/api/batch/list")
    .then(res => res.json())
    .then(data => {

      const tbody =
        document.querySelector("#batchTable tbody");

      tbody.innerHTML = "";

      data.forEach((row, i) => {

        tbody.innerHTML += `
          <tr>
            <td>${i + 1}</td>
            <td>${row.batch_name}</td>
            <td>
              <button class="btn purple"
                onclick="editBatch(${row.id}, '${row.batch_name}')">
                Edit
              </button>
            </td>

            <td>
              <button class="btn red"
                onclick="deleteBatch(${row.id})">
                Delete
              </button>
            </td>
          </tr>
        `;
      });
    });
}

/* ================= EDIT ================= */
function editBatch(id, name) {
  editBatchId = id;
  document.getElementById("batchName").value = name;
}

/* ================= DELETE ================= */
function deleteBatch(id) {

  if (!confirm("Permanently delete batch?")) return;

  fetch("/api/batch/delete/" + id, {
    method: "DELETE"
  })
  .then(res => res.json())
  .then(() => loadBatches());
}


/* ====================== Section Master ===================== */let editSectionId = null;

/* ================= OPEN SECTION ================= */
function openSection() {
  hideAllScreens();
  document.getElementById("sectionMaster").style.display = "block";
  loadSections();
}

/* ================= SAVE ================= */
function saveSection() {

  const section_name =
    document.getElementById("sectionName").value.trim();

  if (!section_name) {
    alert("Enter section");
    return;
  }

  // ADD
  if (editSectionId === null) {

    fetch("/api/section/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section_name })
    })
    .then(res => res.json())
    .then(() => {
      document.getElementById("sectionName").value = "";
      loadSections();
    });

  }

  // UPDATE
  else {

    fetch("/api/section/update/" + editSectionId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section_name })
    })
    .then(res => res.json())
    .then(() => {
      editSectionId = null;
      document.getElementById("sectionName").value = "";
      loadSections();
    });
  }
}

/* ================= LOAD ================= */
function loadSections() {

  fetch("/api/section/list")
    .then(res => res.json())
    .then(data => {

      const tbody =
        document.querySelector("#sectionTable tbody");

      tbody.innerHTML = "";

      data.forEach((row, i) => {

        tbody.innerHTML += `
          <tr>
            <td>${i + 1}</td>
            <td>${row.section_name}</td>

            <td>
              <button class="btn purple"
                onclick="editSection(${row.id}, '${row.section_name}')">
                Edit
              </button>
            </td>

            <td>
              <button class="btn red"
                onclick="deleteSection(${row.id})">
                Delete
              </button>
            </td>
          </tr>
        `;
      });
    });
}

/* ================= EDIT ================= */
function editSection(id, name) {
  editSectionId = id;
  document.getElementById("sectionName").value = name;
}

/* ================= DELETE ================= */
function deleteSection(id) {

  if (!confirm("Delete section permanently?")) return;

  fetch("/api/section/delete/" + id, {
    method: "DELETE"
  })
  .then(() => loadSections());
}
/* ================= OPEN STUDENT MANAGEMENT ================= */


function loadStudents() {
    alert("Next step backend will load students here");
}

function generateExcel() {
    alert("Excel template generation next step");
}

function uploadExcel() {
    alert("Excel upload next step");
}

document.addEventListener("DOMContentLoaded", () => {
  loadBranches();
});
