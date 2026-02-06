/* ================= PROGRAMME MASTER JS ================= */

/* ================= SAVE PROGRAMME ================= */
let editProgrammeId = null;
function saveProgramme() {
  const name = document.getElementById("programmeName").value.trim();

  if (!name) {
    alert("Enter programme name");
    return;
  }

  const url = editProgrammeId
    ? `/api/programme/update/${editProgrammeId}`
    : "/api/programme/add";

  const method = editProgrammeId ? "PUT" : "POST";

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ programme_name: name })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Saved successfully");
        document.getElementById("programmeName").value = "";
        editProgrammeId = null;
        loadProgrammes();
      } else {
        alert(data.message || "Error saving");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Network error");
    });
}


/* ================= LOAD PROGRAMME LIST ================= */
function loadProgrammes() {
  fetch("/api/programme/list")
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#programmeTable tbody");
      tbody.innerHTML = "";

      if (!data || data.length === 0) {
        tbody.innerHTML = "<tr><td colspan='4'>No records</td></tr>";
        return;
      }

      data.forEach((item, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${i + 1}</td>
          <td>${item.programme_name}</td>
          <td><button onclick="editProgramme(${item.id}, '${item.programme_name}')">Edit</button></td>
          <td><button onclick="deleteProgramme(${item.id})">Delete</button></td>
        `;
        tbody.appendChild(tr);
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
    .then(data => {
      if (data.success) {
        alert("Deleted successfully");
        loadProgrammes();
      } else {
        alert(data.message || "Error deleting");
      }
    });
}
