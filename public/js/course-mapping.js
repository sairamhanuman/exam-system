document.addEventListener("DOMContentLoaded", () => {
  loadFilters();

  document.getElementById("newBtn").onclick = () => {
    document.getElementById("entryBox").classList.remove("hidden");
  };

  document.getElementById("saveBtn").onclick = saveMapping;
  document.getElementById("showBtn").onclick = loadMappings;
});

function loadFilters() {
  fetch("/api/course-mapping/filters")
    .then(res => res.json())
    .then(data => {
      fill("programme", data.programmes);
      fill("branch", data.branches);
      fill("semester", data.semesters);
      fill("regulation", data.regulations);
      fillCourse(data.courses);
      fill("batch", data.batches);
      fill("section", data.sections);
      fillStaff(data.staff);
    });
}

function fill(id, rows) {
  const s = document.getElementById(id);
  s.innerHTML = `<option value="">Select</option>`;
  rows.forEach(r => {
    s.innerHTML += `<option value="${r.id}">${r.name}</option>`;
  });
}

function fillCourse(rows) {
  const s = document.getElementById("course");
  s.innerHTML = `<option value="">Select Course</option>`;
  rows.forEach(r => {
    s.innerHTML += `<option value="${r.id}">
      ${r.course_code} - ${r.course_name}
    </option>`;
  });
}

function fillStaff(rows) {
  const s = document.getElementById("staff");
  s.innerHTML = `<option value="">Select Faculty</option>`;
  rows.forEach(r => {
    s.innerHTML += `<option value="${r.id}">
      ${r.department}-${r.emp_id}-${r.staff_name}
    </option>`;
  });
}

function saveMapping() {
  const body = {
    programme_id: programme.value,
    branch_id: branch.value,
    semester_id: semester.value,
    regulation_id: regulation.value,
    course_id: course.value,
    batch_id: batch.value,
    section_id: section.value,
    staff_id: staff.value
  };

  fetch("/api/course-mapping/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }).then(() => loadMappings());
}

function loadMappings() {
  fetch("/api/course-mapping/list")
    .then(res => res.json())
    .then(rows => {
      const tb = document.querySelector("#mappingTable tbody");
      tb.innerHTML = "";
      rows.forEach(r => {
        tb.innerHTML += `
          <tr>
            <td>${r.programme}</td>
            <td>${r.branch}</td>
            <td>${r.semester}</td>
            <td>${r.regulation}</td>
            <td>${r.course}</td>
            <td>${r.batch}</td>
            <td>${r.section}</td>
            <td>${r.faculty}</td>
            <td>
              <button onclick="deleteMap(${r.id})">Delete</button>
            </td>
          </tr>`;
      });
    });
}

function deleteMap(id) {
  fetch(`/api/course-mapping/delete/${id}`, { method: "DELETE" })
    .then(() => loadMappings());
}
