import { app } from "./config.js"; // ensure Firebase initialized

const issueContainer = document.getElementById("issues");
const params = new URLSearchParams(window.location.search);
const selectedCategory = params.get('category');

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
    let list = issueList;
    if (selectedCategory) {
      list = issueList.filter((issue) => issue.issueCategory === selectedCategory);
      const catAll = document.getElementById('cat_all');
      if (catAll) catAll.checked = false;
      const cb = document.querySelector(`.cat[value="${selectedCategory}"]`);
      if (cb) cb.checked = true;
    }
    list.forEach((issue) => {
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
    });
  })
  .catch((error) => {
    console.error("Error loading issues:", error);
    alert("Failed to load issues. Please try again later.");
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