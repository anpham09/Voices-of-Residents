const STORAGE_KEY = "issues";
emailjs.init("c2EOPyI6YkvLrSI_S");

const issueContainer = document.getElementById("issues");
const params = new URLSearchParams(window.location.search);
const selectedCategory = params.get("category");

const recentRaw = sessionStorage.getItem("recentIssue");
let recentIssue = null;
if (recentRaw) {
  try {
    recentIssue = JSON.parse(recentRaw);
  } catch (e) {
    console.error("Failed to parse recent issue", e);
  }
  sessionStorage.removeItem("recentIssue");
}

const renderIssue = (issue) => {
  const template = `
    <div class="issue_container">
      <div class="issue_container_left">
        <div class="issue_category">${issue.issueCategory ?? ""}</div>
        <div class="issue_title">${issue.issueTitle ?? ""}</div>
        <div class="issue_description">${issue.issueDesc ?? ""}</div>
      </div>
      <div class="issue_container_right">
        <img src="${issue.image ?? ""}" alt="" class="issue_img">
      </div>
    </div>
  `;
  issueContainer?.insertAdjacentHTML("beforeend", template);
};

if (selectedCategory) {
  const catAll = document.getElementById("cat_all");
  if (catAll) catAll.checked = false;
  const cb = document.querySelector(`.cat[value="${selectedCategory}"]`);
  if (cb) cb.checked = true;
}

let list = [];
try {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  list = Array.isArray(stored) ? stored : [];
} catch (e) {
  console.error("Failed to parse issues from localStorage", e);
}

if (recentIssue) {
  list = list.filter((i) => i.id !== recentIssue.id);
  list.unshift(recentIssue);
}


list.sort((a, b) => {
  const ta = Number(a.createdAt) || Number(a.id) || 0;
  const tb = Number(b.createdAt) || Number(b.id) || 0;
  return tb - ta;
});

if (selectedCategory) {
  list = list.filter((issue) => issue.issueCategory === selectedCategory);
}

list.forEach(renderIssue);

const exportBtn = document.getElementById("exportPdf");

if (exportBtn) {
  exportBtn.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Hello! This is your exported PDF.", 10, 10);

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; 
    doc.save(`export_${formattedDate}.pdf`);
  });
}


const sendBtn = document.getElementById("sendEmail");

function getFiltersSummary() {
  const checkedCats = Array.from(document.querySelectorAll('.cat:checked')).map(el => el.value);
  const byUrl = (new URLSearchParams(window.location.search)).get("category");

  let categoryPart = "All categories";
  if (checkedCats.length > 0) categoryPart = `Category: ${checkedCats.join(", ")}`;
  else if (byUrl) categoryPart = `Category: ${byUrl}`;

  return categoryPart;
}

if (sendBtn) {
  sendBtn.addEventListener("click", async () => {
    const email = document.getElementById("emailInput")?.value.trim();
    if (!email) {
      alert("Please enter a valid email address.");
      return;
    }

    const now = new Date();
    const generated_date = now.toISOString().split("T")[0]; 
    const generated_time = now.toTimeString().slice(0, 5);  
    const filtersSummary = getFiltersSummary();

    const record_count = String(Array.isArray(list) ? list.length : 0);

    const recipient_name = "Resident";

    const message = "Here is your requested report.";

    sendBtn.disabled = true;
    sendBtn.textContent = "Sending...";

    try {
      await emailjs.send(
        "service_hg6gvqm",
        "template_bo1bp6o", 
        {
          to_email: email,
          recipient_name,
          requested_by: "Voices of Residents",
          generated_date,
          generated_time,
          filters: filtersSummary,
          record_count,
          message,
          note: "If you did not request this, you can ignore this email."
        }
      );

      alert(`Report sent to ${email}`);
    } catch (err) {
      console.error(err);
      alert("Failed to send email. Try again later.");
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = "Send Report to Email";
    }
  });
}




const clearBtn = document.getElementById("clearFilters");
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    const search = document.getElementById("searchKeywords");
    const email = document.getElementById("emailInput");
    if (search) search.value = "";
    if (email) email.value = "";
    document.querySelectorAll(".cat").forEach((cb) => (cb.checked = false));
    const all = document.getElementById("cat_all");
    if (all) all.checked = true;

    issueContainer.innerHTML = "";
    let fresh = [];
    try {
      fresh = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(fresh)) fresh = [];
    } catch (_) {}
    fresh
      .sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0))
      .forEach(renderIssue);
  });
}
