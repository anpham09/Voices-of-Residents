fetch("https://68795a5563f24f1fdca1c567.mockapi.io/Issues")
  .then((response) => response.json())
  .then((issueList) => {
    if (!Array.isArray(issueList)) {
      console.error("Invalid response data");
      return;
    }

    const body = document.body;

    issueList.forEach((issue) => {
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
      body.insertAdjacentHTML("beforeend", template);
    });
  })
  .catch((error) => {
    console.error("Error loading issues:", error);
    alert("Failed to load issues. Please try again later.");
  });