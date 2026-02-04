// Helper to safely get elements
function el(id) {
  return document.getElementById(id);
}

// Helper to safely show elements
function showIfExists(id) {
  const e = el(id);
  if (e && e.style) {
    e.style.display = 'block';
  } else if (!e) {
    console.warn(`showIfExists: Element not found: ${id}`);
  }
}

// Helper to safely hide elements
function hideIfExists(id) {
  const e = el(id);
  if (e && e.style) {
    e.style.display = 'none';
  } else if (!e) {
    console.warn(`hideIfExists: Element not found: ${id}`);
  }
}





// Hide all "screens" in the rightContent area and any dynamically injected external content
function hideAllScreens() {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => {
    if (screen && screen.style) {
      screen.style.display = 'none';
    }
  });

  // Hide externalContent if it's being used
  hideIfExists('externalContent');
}

// Load the default home screen
window.onload = () => {
  hideAllScreens();

  const home = el("home");
  if (home) {
    home.style.display = "block";
  } else {
    console.error("❌ Home element not found!");
  }
};


function openCourseMappingPage() {
  fetch("/course-mapping.html")
    .then(res => res.text())
    .then(html => {
      const container = el("rightContent");
      if (!container) {
        console.error("openCourseMappingPage: #rightContent not found!");
        return;
      }

      // Create externalContent container if it doesn't exist
      let external = el("externalContent");
      if (!external) {
        external = document.createElement("div");
        external.id = "externalContent";
        container.appendChild(external);
      }

      // Replace externalContent with the new HTML content
      external.innerHTML = html;
      external.style.display = 'block';

      // Remove old script if it exists
      const oldScript = el("courseMappingJS");
      if (oldScript) oldScript.remove();

      // Load the course-mapping.js script dynamically
      const script = document.createElement("script");
      script.src = "/js/course-mapping.js";
      script.id = "courseMappingJS";

      // Initialize functions for course mapping when the script is loaded
      script.onload = () => {
        if (typeof loadFilters === "function") loadFilters();
        if (typeof loadExtras === "function") loadExtras();
      };

      document.body.appendChild(script);
    })
    .catch(err => console.error("Failed to load course-mapping.html:", err));
}





// Open Pre-Examinations
function openPreExam() {
  hideAllScreens();
  showIfExists("preExam");
}

// Open the Home screen
function goHome() {
  hideAllScreens();
  showIfExists("home");
}

// Back to Pre-Examinations
function backToPreExam() {
  hideAllScreens();
  showIfExists("preExam");
}


// Toggle the Masters submenu
function toggleMastersSubmenu() {
  const submenu = document.querySelector('.nav-sub');
  if (!submenu) return;

  if (submenu.style.display === 'block') {
    submenu.style.display = 'none';
    const toggle = el('mastersToggle');
    if (toggle) toggle.textContent = '▶ Masters';
  } else {
    submenu.style.display = 'block';
    const toggle = el('mastersToggle');
    if (toggle) toggle.textContent = '▼ Masters';
  }
}

// Navigate between different sections
function openPage(elm, page) {
  // Highlight the active menu item in the sidebar
  document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
  if (elm && elm.classList) elm.classList.add("active");

  // Open the specified page based on the section (with null checks)
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
// Open Programme Master
function openProgramme() {
  hideAllScreens();
  if (!el("programmeMaster")) {
    console.warn("openProgramme: programmeMaster not found!");
    return;
  }
  showIfExists("programmeMaster");
  if (typeof loadProgrammes === "function") loadProgrammes();
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
/* ================= OPEN BRANCH MASTER ================= */

let editBranchId = null;

function openBranch() {
  hideAllScreens();
  if (!el("branchMaster")) {
    console.warn("openBranch: branchMaster not found!");
    return;
  }
  showIfExists("branchMaster");
  if (typeof loadProgrammeDropdown === "function") loadProgrammeDropdown();
  if (typeof loadBranches === "function") loadBranches();
}

  // Attach event listener here
const showBtn = document.getElementById("btnShowBranches");

  if (showBtn) {
    showBtn.onclick = () => {
      const programmeId = document.getElementById("branchProgramme").value;
      console.log("Show clicked for programmeId:", programmeId);

      fetch(`/api/branch/list?programmeId=${programmeId}`)
        .then(res => res.json())
        .then(data => {
          console.log("Branches returned:", data); // debug

          const tbody = document.querySelector("#branchTable123 tbody");
          tbody.innerHTML = "";

          data.forEach((row, i) => {
            tbody.innerHTML += `
              <tr>
                <td>${i + 1}</td>
                <td>${row.programme_name}</td>
                <td>${row.branch_name}</td>
                <td>
                  <button onclick="editBranch(${row.id}, ${row.programme_id}, '${row.branch_name}')">Edit</button>
                </td>
                <td>
                  <button onclick="deleteBranch(${row.id})">Delete</button>
                </td>
              </tr>
            `;
          });
        });
    };
  } else {
    console.error("btnBranchShow NOT FOUND");
  }
}

/* ================= LOAD PROGRAMME DROPDOWN ================= */

function loadProgrammeDropdown() {
  fetch("/api/programme/list")
    .then(res => res.json())
    .then(data => {
      const sel = document.getElementById("branchProgramme");
      sel.innerHTML = "<option value=''>Select Programme</option>";

      data.forEach(p => {
        sel.innerHTML += `
          <option value="${p.id}">${p.programme_name}</option>
        `;
      });
    });
}

/* ================= SAVE BRANCH ================= */

function saveBranch() {
  const programme_id = document.getElementById("branchProgramme").value;
  const branch_name = document.getElementById("branchName").value.trim();

  if (!programme_id || !branch_name) {
    alert("Select programme and enter branch");
    return;
  }

  const url = editBranchId
    ? "/api/branch/update/" + editBranchId
    : "/api/branch/add";

  const method = editBranchId ? "PUT" : "POST";

  fetch(url, {
    method,
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

/* ================= LOAD BRANCH TABLE ================= */

function loadBranches(programmeId = null) {
  fetch("/api/branch/list")
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#branchTable123 tbody");
      if (!tbody) {
        console.error("branchTable123 tbody NOT FOUND");
        return;
      }
      tbody.innerHTML = "";

      // Filter by programmeId if provided
      if (programmeId) {
        data = data.filter(row => row.programme_id == programmeId);
      }

      data.forEach((row, i) => {
        tbody.innerHTML += `
          <tr>
            <td>${i + 1}</td>
            <td>${row.programme_name}</td>
            <td>${row.branch_name}</td>
            <td>
              <button onclick="editBranch(${row.id}, ${row.programme_id}, '${row.branch_name}')">Edit</button>
            </td>
            <td>
              <button onclick="deleteBranch(${row.id})">Delete</button>
            </td>
          </tr>
        `;
      });
    });
}





/* ================= EDIT BRANCH ================= */

function editBranch(id, programme_id, branch_name) {
  editBranchId = id;
  document.getElementById("branchProgramme").value = programme_id;
  document.getElementById("branchName").value = branch_name;
}

/* ================= DELETE BRANCH ================= */

function deleteBranch(id) {
  if (!confirm("Delete this branch?")) return;

  fetch("/api/branch/" + id, { method: "DELETE" })
    .then(() => loadBranches());
}


/* ================= OPEN SEMESTER MASTER ================= */
let editSemesterId = null;

/* ================= OPEN SEMESTER ================= */
function openSemester() {
  hideAllScreens();
  if (!el("semesterMaster")) {
    console.warn("openSemester: semesterMaster not found!");
    return;
  }
  showIfExists("semesterMaster");
  if (typeof loadSemesters === "function") loadSemesters();
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
  if (!el("regulationMaster")) {
    console.warn("openRegulation: regulationMaster not found!");
    return;
  }
  showIfExists("regulationMaster");
  if (typeof loadRegulations === "function") loadRegulations();
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
  if (!el("batchMaster")) {
    console.warn("openBatch: batchMaster not found!");
    return;
  }
  showIfExists("batchMaster");
  if (typeof loadBatches === "function") loadBatches();
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
  if (!el("sectionMaster")) {
    console.warn("openSection: sectionMaster not found!");
    return;
  }
  showIfExists("sectionMaster");
  if (typeof loadSections === "function") loadSections();
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

// Open Student Management
function openStudentManagement() {
  hideAllScreens();
  if (!el("studentManagement")) {
    console.warn("openStudentManagement: studentManagement not found!");
    return;
  }
  showIfExists("studentManagement");
  if (typeof loadStudents === "function") loadStudents();
}
function loadStudents() {
    alert("Next step backend will load students here");
}

function generateExcel() {
    alert("Excel template generation next step");
}

function uploadExcel() {
    alert("Excel upload next step");
}

