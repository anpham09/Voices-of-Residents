const STORAGE_KEY = "issues";

const form = document.getElementById("submitIssueFormContainer");
const formFile = document.getElementById("formFile");
const formFileContainer = document.querySelector(".formFileContainer");
const formFileUploaded = document.querySelector(".formFileUploaded");

const formInput = document.querySelectorAll(".formInput");

const data = {}; 

formFile?.addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    formFileUploaded.src = reader.result;
    formFileUploaded.style.display = "block";
    if (formFileContainer) formFileContainer.style.display = "none";
    data.image = reader.result;
  };
  reader.readAsDataURL(file);
});

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  let valid = true;
  for (const input of formInput) {
    const value = input.value.trim();
    data[input.name] = value;
    if (!value) valid = false;
  }

  if (!valid) {
    alert("Please fill in all required fields.");
    return;
  }

  if (!data.image) data.image = "";

  const issue = {
    id: String(Date.now()), 
    createdAt: Date.now(),
    ...data,
  };

  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(existing)) throw new Error("Corrupt storage");
    existing.push(issue);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (err) {
    console.error("Failed to save to localStorage:", err);
    alert("Storage error. Please clear site data or try again.");
    return;
  }

  sessionStorage.setItem("recentIssue", JSON.stringify(issue));

  alert("Issue submitted successfully!");
  window.location.href = `./viewIssue.html?category=${encodeURIComponent(
    issue.issueCategory
  )}#filterSection`;
});
