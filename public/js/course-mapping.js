window.onload = () => {
  loadFilters();
  loadExtras();
};

function loadFilters() {
  fetch("/api/course-mapping/filters")
    .then(res => res.json())
    .then(data => {
      fill("programme", data.programmes, "programme_name");
      fill("branch", data.branches, "branch_name");
      fill("semester", data.semesters, "semester_name");
      fill("regulation", data.regulations, "regulation_name");
      fillCourse(data.courses);
    })
    .catch(err => console.error(err));
}

function loadExtras() {
  fetch("/api/course-mapping/extras")
    .then(res => res.json())
    .then(data => {
      fill("batch", data.batches, "batch_name");
      fill("section", data.sections, "section_name");
      fill("staff", data.staff, "staff_name");
    });
}

function fill(id, arr, key) {
  const sel = document.getElementById(id);
  sel.innerHTML = `<option value="">Select</option>`;
  arr.forEach(o => {
    sel.innerHTML += `<option value="${o.id}">${o[key]}</option>`;
  });
}

function fillCourse(arr) {
  const sel = document.getElementById("course");
  sel.innerHTML = `<option value="">Select Course</option>`;
  arr.forEach(c => {
    sel.innerHTML += `<option value="${c.id}">
      ${c.course_code} - ${c.course_name}
    </option>`;
  });
}


async function saveMapping() {
  const payload = {
    programme_id: programme.value,
    branch_id: branch.value,
    semester_id: semester.value,
    regulation_id: regulation.value,
    course_id: course.value,
    batch_id: batch.value,
    section_id: section.value,
    staff_id: staff.value
  };

  await fetch("/api/course-mapping/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  loadTable();
}

async function loadTable() {
  const res = await fetch("/api/course-mapping/list");
  const data = await res.json();

  tableBody.innerHTML = "";
  data.forEach((r, i) => {
    tableBody.innerHTML += `
      <tr>
        <td>${i+1}</td>
        <td>${r.course}</td>
        <td>${r.batch}</td>
        <td>${r.section}</td>
        <td>${r.staff}</td>
        <td>
          <button onclick="del(${r.id})">❌</button>
        </td>
      </tr>
    `;
  });
}

async function del(id) {
  await fetch("/api/course-mapping/delete/" + id);
  loadTable();
}

function clearForm() {
  document.querySelectorAll("select").forEach(s => s.value = "");
}
