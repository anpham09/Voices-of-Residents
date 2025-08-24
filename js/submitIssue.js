import { app } from "./config.js";

const form = document.getElementById('submitIssueFormContainer');
const formFile = document.getElementById('formFile');
const formFileContainer = document.querySelector('.formFileContainer');
const formFileUploaded = document.querySelector('.formFileUploaded');

const formInput = document.querySelectorAll(".formInput");

const data = {};

formFile.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const url = URL.createObjectURL(file);
  formFileUploaded.src = url;
  formFileUploaded.style.display = "block";
  formFileContainer.style.display = "none";
  data.image = url;

});



form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let valid = true;
    for (const input of formInput) {
        const value = input.value.trim();
        data[input.name] = value;
        if (!value) {
            valid = false;
        }
    }

    if (!valid) {
        alert("Please fill in all required fields.");
        return;
    }

    try {
        const response = await fetch("https://68795a5563f24f1fdca1c567.mockapi.io/Issues", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        alert("Issue submitted successfully!");
        form.reset();
    } catch (error) {
        console.error("Error submitting issue:", error);
        alert("Failed to submit issue. Please try again later.");
    }
});
