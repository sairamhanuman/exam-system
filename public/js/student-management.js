let currentHtno = "";

/* =====================================================
   STUDENT MANAGEMENT — FRONTEND SCRIPT
===================================================== */

function openStudentManagement() {
  hideAll();
  document.getElementById("studentManagement").style.display = "block";

  // ✅ load dropdowns AFTER screen is visible
  loadFilters();
}

/* =====================================================
   LOAD ALL DROPDOWNS
===================================================== */

function loadFilters() {

  fetch("/api/students/filters")
    .then(res => res.json())
    .then(data => {


        // 🔍 DEBUG — see what backend sends
  console.log("Filters API data:", data)

       
      fill("batch", data.batch, "batch_name");
      fill("programme", data.programme, "programme_name");
      fill("branch", data.branch, "branch_name");
      fill("semester", data.semester, "semester_name");
      fill("regulation", data.regulation, "regulation_name");
      fill("section", data.section, "section_name");

    })
    .catch(err => {
      console.error("Dropdown load error:", err);
      alert("Dropdowns not loading");
    });
}

function fill(id, rows, col) {

  const sel = document.getElementById(id);
  if (!sel) return;

  sel.innerHTML = "<option value=''>Select</option>";

  // ✅ SAFETY CHECK
  if (!Array.isArray(rows)) {
    console.warn(`Dropdown '${id}' data is not array:`, rows);
    return;
  }

  rows.forEach(r => {
    sel.innerHTML +=
      `<option value="${r[col]}">${r[col]}</option>`;
  });
}


/* =====================================================
   GENERATE EXCEL TEMPLATE
===================================================== */

function generateExcel() {

  const data = {
    batch: getVal("batch"),
    programme: getVal("programme"),
    branch: getVal("branch"),
    semester: getVal("semester"),
    regulation: getVal("regulation")
  };

  if (
    !data.batch ||
    !data.programme ||
    !data.branch ||
    !data.semester ||
    !data.regulation
  ) {
    alert("Select all fields");
    return;
  }

  fetch("/api/students/generate-excel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.blob())
    .then(blob => {

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "StudentTemplate.xlsx";
      a.click();
    });
}

/* =====================================================
   UPLOAD EXCEL
===================================================== */

function uploadExcel() {

  const file = document.getElementById("excelFile").files[0];

  if (!file) {
    alert("Select Excel file");
    return;
  }

  const form = new FormData();

  form.append("file", file);

  // ✅ send selected dropdown values
  form.append("batch", getVal("batch"));
  form.append("programme", getVal("programme"));
  form.append("branch", getVal("branch"));
  form.append("semester", getVal("semester"));
  form.append("regulation", getVal("regulation"));

  fetch("/api/students/upload-excel", {
    method: "POST",
    body: form
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      loadStudentList();
    })
    .catch(err => {
      alert("Upload failed");
      console.error(err);
    });
}

/* =====================================================
   HELPERS
===================================================== */

function getVal(id) {
  return document.getElementById(id).value;
}

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB");
}


async function loadStudentList() {

  const batch = getVal("batch");
  const programme = getVal("programme");
  const branch = getVal("branch");
  const semester = getVal("semester");
  const regulation = getVal("regulation");
  const status = document.getElementById("statusFilter").value;

   // 🔍 ADD THIS LINE EXACTLY HERE
  console.log({ batch, programme, branch, semester, regulation, status });

  // 🔒 validation
 
  if (!batch || !programme || !branch || !semester || !regulation) {
    document.getElementById("rollList").innerHTML = "";
    return; // ⛔ stop API call
  }

  const res = await fetch(
    `/api/students/list?batch=${batch}` +
    `&programme=${programme}` +
    `&branch=${branch}` +
    `&semester=${semester}` +
    `&regulation=${regulation}` +
    `&status=${status}`
  );

  const data = await res.json();

  const list = document.getElementById("rollList");
  list.innerHTML = "";

  data.forEach((s, i) => {

    const div = document.createElement("div");
    div.className = "roll-row";

    div.innerHTML = `
      <span>${i + 1}</span>
      <span>${s.htno}</span>
    `;

    div.onclick = () => loadStudentDetails(s.htno);

    list.appendChild(div);
  });
}


async function uploadBulkPhotos() {

  const files =
    document.getElementById("bulkPhotoUpload").files;

  if (files.length === 0) {
    alert("Select folder");
    return;
  }

  const fd = new FormData();

  for (let f of files) {
    fd.append("photos", f);
  }

  const res = await fetch("/api/students/upload-photos", {
    method: "POST",
    body: fd
  });

  const data = await res.json();

  alert(`Uploaded ${data.uploaded} photos`);
}

async function loadStudentDetails(htno) {

  currentHtno = htno;

  const res = await fetch(`/api/students/details/${htno}`);
  const s = await res.json();

  if (!s) return;

  document.getElementById("d_htno").innerText = s.htno;

  document.getElementById("e_admno").value = s.admno || "";
  document.getElementById("e_name").value = s.student_name || "";
  document.getElementById("e_father").value = s.father_name || "";
  document.getElementById("e_mother").value = s.mother_name || "";
  document.getElementById("e_sex").value = s.sex ?? 0;
  document.getElementById("e_dob").value = s.dob ? s.dob.substring(0,10) : "";
  document.getElementById("e_age").value = s.age || "";
  document.getElementById("e_aadhar").value = s.aadhar_no || "";
  document.getElementById("e_mobile").value = s.student_mobile || "";
  document.getElementById("e_parent").value = s.parent_mobile || "";
  document.getElementById("e_doj").value = s.doj ? s.doj.substring(0,10) : "";
  document.getElementById("e_section").value = s.section || "";
  document.getElementById("e_status").value = s.status || "On Roll";

loadStudentPhoto(htno);
}
function loadStudentPhoto(htno) {

  const img = document.getElementById("studentPhoto");

  const extensions = ["jpg", "jpeg", "png"];

  let index = 0;

  function tryNext() {

    if (index >= extensions.length) {
      img.src = "uploads/students/no-photo.png";
      return;
    }

    const url =
      `uploads/students/${htno}.${extensions[index]}?t=${Date.now()}`;

    const testImg = new Image();

    testImg.onload = () => img.src = url;

    testImg.onerror = () => {
      index++;
      tryNext();
    };

    testImg.src = url;
  }

  tryNext();
}

function enableEdit() {

  // show save button
  document.getElementById("saveBtn").style.display = "inline-block";

}

async function saveStudent() {

  const data = {
    admno: document.getElementById("e_admno").value,
    student_name: document.getElementById("e_name").value,
    father_name: document.getElementById("e_father").value,
    mother_name: document.getElementById("e_mother").value,
    sex: document.getElementById("e_sex").value,
    dob: document.getElementById("e_dob").value,
    age: document.getElementById("e_age").value,
    aadhar_no: document.getElementById("e_aadhar").value,
    student_mobile: document.getElementById("e_mobile").value,
    parent_mobile: document.getElementById("e_parent").value,
    doj: document.getElementById("e_doj").value,
    section: document.getElementById("e_section").value,
    status: document.getElementById("e_status").value
  };

  const res = await fetch(`/api/students/update/${currentHtno}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const r = await res.json();

  if (r.success) {
    alert("Student updated successfully");
    document.getElementById("saveBtn").style.display = "none";
    loadStudentDetails(currentHtno);
  }
}


/* =====================================================
   UPLOAD PHOTO
===================================================== */
async function uploadPhoto() {

  const file =
    document.getElementById("photoUpload").files[0];

  if (!file) {
    alert("Select photo");
    return;
  }

  const fd = new FormData();
  fd.append("photo", file);

  await fetch(
    `/api/students/upload-photo/${currentHtno}`,
    {
      method: "POST",
      body: fd
    }
  );

  loadStudentDetails(currentHtno);
}
