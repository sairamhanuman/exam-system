window.onload = () => {
  loadFilters();
  loadTable();
};


function fillSelect(id, list, labelFn) {
  const sel = document.getElementById(id);
  sel.innerHTML = `<option value="">Select</option>`;
  list.forEach(v => {
    sel.innerHTML += `<option value="${v}">${labelFn ? labelFn(v) : v}</option>`;
  });
}

/* ---------- FILTER DROPDOWNS ---------- */
async function loadFilters() {
  const res = await fetch("/api/course-mapping/filters");

  if (!res.ok) {
    alert("Failed to load filters");
    return;
  }

  const data = await res.json();
  console.log("Filters:", data);
}


function loadDependentData() {
  const payload = {
    programme: programme.value,
    branch: branch.value,
    semester: semester.value,
    regulation: regulation.value
  };

  if (!payload.programme || !payload.branch || !payload.semester || !payload.regulation) return;

  fetch("/api/course-mapping/dependent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(r => r.json())
  .then(d => {
    fillSelect("course", d.courses, c => c);
    fillSelect("batch", d.batch);
    fillSelect("section", d.section);
    fillSelect("faculty", d.faculty);
  });
}

/* ---------- SAVE ---------- */
function saveMapping() {
  const data = {
    programme: programme.value,
    branch: branch.value,
    semester: semester.value,
    regulation: regulation.value,
    course: course.value,
    batch: batch.value,
    section: section.value,
    faculty: faculty.value
  };

  fetch("/api/course-mapping/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(r => r.json())
  .then(() => {
    alert("Course mapped successfully");
    loadTable();
  });
}

function clearForm() {
  document.querySelectorAll("select").forEach(s => s.value = "");
}

/* ---------- TABLE ---------- */
async function loadTable() {
  const res = await fetch("/api/course-mapping/list");

  if (!res.ok) {
    alert("Failed to load mapping list");
    return;
  }

  const data = await res.json();
  console.log("Table:", data);
}


function deleteRow(id) {
  fetch(`/api/course-mapping/delete/${id}`, { method:"DELETE" })
    .then(() => loadTable());
}
