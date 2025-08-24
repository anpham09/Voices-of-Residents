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
            <div class="issue_category">${issue.issueCategory}</div>
            <div class="issue_title">${issue.issueTitle}</div>
            <div class="issue_description">${issue.issueDesc}</div>
          </div>
          <div class="issue_container_right">
            <img src="${issue.image}" alt="" class="issue_img">
          </div>
        </div>
      `;
  issueContainer.insertAdjacentHTML("beforeend", template);
};

// mark filter checkboxes if a category was passed in the URL
if (selectedCategory) {
  const catAll = document.getElementById("cat_all");
  if (catAll) catAll.checked = false;
  const cb = document.querySelector(`.cat[value="${selectedCategory}"]`);
  if (cb) cb.checked = true;
}

// immediately render any recently submitted issue so it appears without waiting for API
if (recentIssue && (!selectedCategory || recentIssue.issueCategory === selectedCategory)) {
  renderIssue(recentIssue);
}

fetch("https://68795a5563f24f1fdca1c567.mockapi.io/Issues", { cache: "no-store" })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json();
  })
  .then((issueList) => {
    if (!Array.isArray(issueList)) {
      console.error("Invalid response data");
      return;
    }

    // show newest issues first so freshly submitted reports are visible
    let list = issueList.sort((a, b) => Number(b.id) - Number(a.id));

    // remove the locally rendered recent issue to avoid duplicates
    if (recentIssue) {
      list = list.filter((i) => i.id !== recentIssue.id);
    }

    if (selectedCategory) {
      list = list.filter((issue) => issue.issueCategory === selectedCategory);
    }

    list.forEach(renderIssue);
  })
  .catch((error) => {
    console.error("Error loading issues:", error);
    if (!recentIssue) {
      alert("Failed to load issues. Please try again later.");
    }
  });

document.getElementById("exportPdf").addEventListener("click", () => {
  alert("PDF export coming soon.");
});

document.getElementById("sendEmail").addEventListener("click", () => {
  const email = document.getElementById("emailInput").value || "your email";
  alert(`Report will be sent to ${email} soon.`);
});

document.getElementById("clearFilters").addEventListener("click", () => {
  document.getElementById("searchKeywords").value = "";
  document.getElementById("emailInput").value = "";
  document.querySelectorAll(".cat").forEach((cb) => (cb.checked = false));
  document.getElementById("cat_all").checked = true;
});