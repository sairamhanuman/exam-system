let editStaffId = null;

console.log("staff js loaded");

function openStaffMaster() {
  hideAllScreens();
  document.getElementById("staffMaster").style.display = "block";
  loadStaff();
}

/* ================= SAVE ================= */

function saveStaff() {

  const formData = new FormData();

  formData.append("emp_id", emp_id.value);
  formData.append("staff_name", staff_name.value);
  formData.append("department", department.value);
  formData.append("designation", designation.value);
  formData.append("experience", experience.value);
  formData.append("mobile", mobile.value);
  formData.append("email", email.value);
  formData.append("gender", gender.value);
  formData.append("doj", doj.value);

  formData.append("bank_name", bank_name.value);
  formData.append("bank_branch", bank_branch.value);
  formData.append("account_no", account_no.value);
  formData.append("ifsc_code", ifsc_code.value);

  formData.append("pan_no", pan_no.value);
  formData.append("status", status.value || "Working");

  // ✅ send old photo if edit
  if (editStaffId && !photo.files[0]) {
    formData.append("old_photo", photo.dataset.old);
  }

  // ✅ new photo
  if (photo.files[0]) {
    formData.append("photo", photo.files[0]);
  }

  const url = editStaffId
    ? "/api/staff/update/" + editStaffId
    : "/api/staff/add";

  fetch(url, {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(() => {
      clearStaff();
      loadStaff();
      editStaffId = null;
      photo.dataset.old = "";
    });
}

/* ================= LOAD ================= */
function loadStaff() {
  fetch("/api/staff/list")
    .then(res => res.json())
    .then(data => {

      console.log("STAFF DATA:", data);

      const tbody = document.querySelector("#staffTable tbody");
      tbody.innerHTML = "";

      if (!Array.isArray(data)) {
        console.error("Staff list error:", data);
        return;
      }

      data.forEach((s, i) => {
  // Escape single quotes in strings to avoid JS errors
  const staffData = JSON.stringify(s).replace(/'/g, "\\'");
  
  tbody.innerHTML += `
    <tr>
      <td>${i + 1}</td>
      <td>${s.emp_id}</td>
      <td>${s.staff_name}</td>
      <td>${s.department}</td>
      <td>${s.designation}</td>
      <td>
        <img src="/uploads/staff/${s.photo || 'no-photo.png'}"
             class="staff-photo"
             onerror="this.src='/uploads/staff/no-photo.png'">
      </td>
      <td>
       <button class="btn-sm btn-edit" onclick='editStaff(${staffData})'>
  Edit
</button>
      </td>
      <td>
    <button class="btn-sm btn-delete" onclick="deleteStaff(${s.id})">
  Delete
</button>
      </td>
    </tr>
  `;
});
    })
    .catch(err => console.error("Fetch error:", err));
}



/* ================= EDIT ================= */

function editStaff(s) {

  editStaffId = s.id;

  emp_id.value = s.emp_id;
  staff_name.value = s.staff_name;
  department.value = s.department;
  designation.value = s.designation;
  experience.value = s.experience;
  mobile.value = s.mobile;
  email.value = s.email;
  gender.value = s.gender;
  doj.value = s.doj?.substring(0, 10);

  bank_name.value = s.bank_name;
  bank_branch.value = s.bank_branch;
  account_no.value = s.account_no;
  ifsc_code.value = s.ifsc_code;

  pan_no.value = s.pan_no;
  status.value = s.status;

  // ✅ store old photo
  photo.dataset.old = s.photo || "";
}

/* ================= DELETE ================= */

function deleteStaff(id) {
  if (!confirm("Delete staff?")) return;

  fetch("/api/staff/delete/" + id, { method: "DELETE" })
    .then(() => loadStaff());
}

function clearStaff() {
  document.querySelectorAll("#staffMaster input")
    .forEach(i => i.value = "");
}
