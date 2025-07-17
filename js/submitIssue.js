const form = document.getElementById('submitIssueFormContainer'); 
const formFile = document.getElementById('formFile');
const formFileContainer = document.querySelector('.formFileContainer');
const formFileUploaded = document.querySelector('.formFileUploaded');

const imagePreview = document.getElementById('imagePreview'); 
const previewImg = document.getElementById('previewImg'); 
const removeImageBtn = document.getElementById('removeImage'); 
const formBtnSubmit = document.getElementById('formBtnSubmit');

const issueTitle = document.getElementById("issueTitle"); 
const formInput = document.querySelectorAll(".formInput"); 

const data = {};

formFile.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const url = URL.createObjectURL(file);
  formFileUploaded.src = url;
  formFileUploaded.style.display = "block";
  formFileContainer.style.display = "none";
  data.url = url;

});



form.addEventListener("submit", (e) => {
    e.preventDefault();


    const data = {};
    for (const input of formInput) {
        data[input.name] = input.value;
    }

    const id = "" + Math.random().toString(16).slice(2);
    console.log(id);
    
    console.log(data);


    fetch("https://68795a5563f24f1fdca1c567.mockapi.io/Issues", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(data),
    });
});
