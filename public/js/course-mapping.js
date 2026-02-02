window.onload = () => {
  loadFilters();
  loadTable();
};

function openCourseMaster() {
  window.location.href = "/course-mapping.html";
}

function fillSelect(id, list, labelFn) {
  const sel = document.getElementById(id);
  sel.innerHTML = `<option value="">Select</option>`;
  list.forEach(v => {
    sel.innerHTML += `<option value="${v}">${labelFn ? labelFn(v) : v}</option>`;
  });
}

/* ---------- FILTER DROPDOWNS ---------- */
function loadFilters() {
  fetch("/api/course-mapping/filters")
    .then(r => r.json())
    .then(d => {
      fillSelect("programme", d.programme);
      fillSelect("branch", d.branch);
      fillSelect("semester", d.semester);
      fillSelect("regulation", d.regulation);
    });
}

["programme","branch","semester","regulation"].forEach(id => {
  document.getElementById(id).addEventListener("change", loadDependentData);
});

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
function loadTable() {
  fetch("/api/course-mapping/list")
    .then(r => r.json())
    .then(data => {
      const tb = document.getElementById("mappingTable");
      tb.innerHTML = "";
      data.forEach((d,i) => {
        tb.innerHTML += `
          <tr>
            <td>${i+1}</td>
            <td>${d.course}</td>
            <td>${d.batch}</td>
            <td>${d.section}</td>
            <td>${d.faculty}</td>
            <td>
              <button onclick="deleteRow(${d.id})">Delete</button>
            </td>
          </tr>`;
      });
    });
}

function deleteRow(id) {
  fetch(`/api/course-mapping/delete/${id}`, { method:"DELETE" })
    .then(() => loadTable());
}
