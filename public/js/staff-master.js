let editStaffId = null;

function openStaffMaster() {
  hideAll();
  staffMaster.style.display = "block";
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
  formData.append("status", status.value);

  if (photo.files[0])
    formData.append("photo", photo.files[0]);

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
    });
}

/* ================= LOAD ================= */

function loadStaff() {
  fetch("/api/staff/list")
    .then(res => res.json())
    .then(data => {

      const tbody = document.querySelector("#staffTable tbody");
      tbody.innerHTML = "";

      data.forEach((s, i) => {
        tbody.innerHTML += `
          <tr>
            <td>${i + 1}</td>
            <td>${s.emp_id}</td>
            <td>${s.staff_name}</td>
            <td>${s.department}</td>
            <td>${s.designation}</td>
            <td>
              <img src="/uploads/staff/${s.photo}"
                   class="staff-photo">
            </td>
            <td>
              <button class="btn purple"
                onclick='editStaff(${JSON.stringify(s)})'>
                Edit
              </button>
            </td>
            <td>
              <button class="btn red"
                onclick="deleteStaff(${s.id})">
                Delete
              </button>
            </td>
          </tr>`;
      });
    });
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
  doj.value = s.doj?.substring(0,10);

  bank_name.value = s.bank_name;
  bank_branch.value = s.bank_branch;
  account_no.value = s.account_no;
  ifsc_code.value = s.ifsc_code;

  pan_no.value = s.pan_no;
  status.value = s.status;
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
