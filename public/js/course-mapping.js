window.onload = () => {
  loadFilters();
  loadTable();
};

async function loadFilters() {
  const res = await fetch("/api/course-mapping/filters");
  const data = await res.json();

  fill("programme", data.programmes);
  fill("branch", data.branches);
  fill("semester", data.semesters);
  fill("regulation", data.regulations);
  fill("course", data.courses);
  fill("batch", data.batches);
  fill("section", data.sections);
  fill("staff", data.staff);
}

function fill(id, arr) {
  const el = document.getElementById(id);
  el.innerHTML = `<option value="">Select</option>`;
  arr.forEach(o => {
    el.innerHTML += `<option value="${o.id}">${o.name}</option>`;
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
