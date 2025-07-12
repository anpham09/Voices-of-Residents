document.addEventListener('DOMContentLoaded', function() {
const form = document.getElementById('submitIssueFormContainer');
const fileInput = document.getElementById('formFile');
const fileContainer = document.getElementById('fileContainer');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const removeImageBtn = document.getElementById('removeImage');
const submitBtn = document.getElementById('formBtnSubmit');
const loader = submitBtn.querySelector('.loader');
const saveText = submitBtn.querySelector('.form-btn-save');

let selectedFile = null;

fileInput.addEventListener('change', handleFileSelect);

fileContainer.addEventListener('click', function(e) {
    if (e.target !== fileInput) {
        fileInput.click();
    }
});

fileContainer.addEventListener('dragover', function(e) {
    e.preventDefault();
    fileContainer.style.borderColor = '#205a4c';
    fileContainer.style.backgroundColor = 'rgba(184, 240, 194, 0.5)';
});

fileContainer.addEventListener('dragleave', function(e) {
    e.preventDefault();
    fileContainer.style.borderColor = 'rgb(168, 223, 177)';
    fileContainer.style.backgroundColor = 'transparent';
});

fileContainer.addEventListener('drop', function(e) {
    e.preventDefault();
    fileContainer.style.borderColor = 'rgb(168, 223, 177)';
    fileContainer.style.backgroundColor = 'transparent';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect({ target: { files: files } });
    }
});

removeImageBtn.addEventListener('click', function() {
    selectedFile = null;
    fileInput.value = '';
    imagePreview.style.display = 'none';
    fileContainer.style.display = 'block';
});

form.addEventListener('submit', handleFormSubmit);

function handleFileSelect(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    const validation = window.IssueTracker.utils.validateFile(file);
    if (!validation.valid) {
        window.IssueTracker.utils.showMessage(validation.error, 'error');
        fileInput.value = '';
        return;
    }

    selectedFile = file;

    const reader = new FileReader();
    reader.onload = function(e) {
        previewImg.src = e.target.result;
        imagePreview.style.display = 'block';
        fileContainer.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(form);
    const title = formData.get('issueTitle').trim();
    const category = formData.get('issueCategory');
    const description = formData.get('issueDesc').trim();

    if (!title) {
        window.IssueTracker.utils.showMessage('Please enter an issue title', 'error');
        document.getElementById('issueTitle').focus();
        return;
    }

    if (!category) {
        window.IssueTracker.utils.showMessage('Please select a category', 'error');
        document.getElementById('issueCategory').focus();
        return;
    }

    if (!description) {
        window.IssueTracker.utils.showMessage('Please enter an issue description', 'error');
        document.getElementById('issueDesc').focus();
        return;
    }

    setLoadingState(true);

    try {
        const issue = {
            title: window.IssueTracker.utils.sanitizeHtml(title),
            category: category,
            description: window.IssueTracker.utils.sanitizeHtml(description),
            timestamp: new Date().toISOString()
        };

        if (selectedFile) {
            try {
                const imageData = await window.IssueTracker.utils.fileToBase64(selectedFile);
                issue.image = imageData;
                issue.imageName = selectedFile.name;
                issue.imageType = selectedFile.type;
            } catch (error) {
                console.error('Error processing image:', error);
                window.IssueTracker.utils.showMessage('Error processing image file', 'error');
                setLoadingState(false);
                return;
            }
        }
        const result = window.IssueTracker.storage.saveIssue(issue);

        if (result.success) {
            window.IssueTracker.utils.showMessage('Issue submitted successfully!', 'success');
            
            form.reset();
            selectedFile = null;
            imagePreview.style.display = 'none';
            fileContainer.style.display = 'block';
            
            setTimeout(() => {
                window.IssueTracker.utils.navigateTo('./viewIssues.html');
            }, 1500);
        } else {
            window.IssueTracker.utils.showMessage(result.error || 'Failed to submit issue', 'error');
        }
    } catch (error) {
        console.error('Error submitting issue:', error);
        window.IssueTracker.utils.showMessage('An unexpected error occurred', 'error');
    } finally {
        setLoadingState(false);
    }
}

function setLoadingState(loading) {
    if (loading) {
        submitBtn.disabled = true;
        loader.style.display = 'block';
        saveText.style.display = 'none';
    } else {
        submitBtn.disabled = false;
        loader.style.display = 'none';
        saveText.style.display = 'block';
    }
}
const inputs = form.querySelectorAll('.formInput');
inputs.forEach(input => {
    input.addEventListener('blur', function() {
        validateField(this);
    });

    input.addEventListener('input', function() {
        this.style.borderColor = '';
    });
});

function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');

    if (isRequired && !value) {
        field.style.borderColor = '#dc3545';
        return false;
    } else if (value) {
        field.style.borderColor = '#28a745';
        return true;
    } else {
        field.style.borderColor = '';
        return true;
    }
}

const textarea = document.getElementById('issueDesc');
if (textarea) {
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.max(100, this.scrollHeight) + 'px';
    });
}
const urlParams = window.IssueTracker.utils.getUrlParams();
if (urlParams.category) {
    const categorySelect = document.getElementById('issueCategory');
    if (categorySelect && window.IssueTracker.config.categories.includes(urlParams.category)) {
        categorySelect.value = urlParams.category;
    }
}
});