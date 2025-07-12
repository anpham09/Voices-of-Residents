document.addEventListener('DOMContentLoaded', function() {
const issuesContainer = document.getElementById('issuesContainer');
const emptyState = document.getElementById('emptyState');
const loadingState = document.getElementById('loadingState');
const categoryFilter = document.getElementById('categoryFilter');
const clearFiltersBtn = document.getElementById('clearFilters');

let allIssues = [];
let filteredIssues = [];
let currentFilter = '';


init();

function init() {
    showLoadingState();
    
    setTimeout(() => {
        loadIssues();
        setupEventListeners();
        handleUrlParams();
    }, 500);
}

function setupEventListeners() { categoryFilter.addEventListener('change', function() {
        currentFilter = this.value;
        filterAndDisplayIssues();
    });

    clearFiltersBtn.addEventListener('click', function() {
        currentFilter = '';
        categoryFilter.value = '';
        filterAndDisplayIssues();
        
        const url = new URL(window.location);
        url.searchParams.delete('category');
        window.history.replaceState({}, '', url);
    });
}

function loadIssues() {
    try {
        allIssues = window.IssueTracker.storage.getIssues();
        filterAndDisplayIssues();
    } catch (error) {
        console.error('Error loading issues:', error);
        showError('Failed to load issues');
    }
}

function filterAndDisplayIssues() {
    hideLoadingState();

    // Apply filters
    if (currentFilter) {
        filteredIssues = allIssues.filter(issue => issue.category === currentFilter);
    } else {
        filteredIssues = [...allIssues];
    }

    if (filteredIssues.length === 0) {
        showEmptyState();
    } else {
        showIssues();
    }

    updateFilterInfo();
}

function showIssues() {
    emptyState.style.display = 'none';
    issuesContainer.style.display = 'block';
    issuesContainer.innerHTML = '';

    filteredIssues.forEach(issue => {
        const issueElement = createIssueElement(issue);
        issuesContainer.appendChild(issueElement);
    });
}

function createIssueElement(issue) {
    const issueDiv = document.createElement('div');
    issueDiv.className = 'issue_container';
    issueDiv.setAttribute('data-issue-id', issue.id);
    const leftDiv = document.createElement('div');
    leftDiv.className = 'issue_container_left';

    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'issue_category';
    categoryDiv.textContent = issue.category;

    const titleDiv = document.createElement('div');
    titleDiv.className = 'issue_title';
    titleDiv.textContent = issue.title;

    const descDiv = document.createElement('div');
    descDiv.className = 'issue_description';
    descDiv.textContent = issue.description;

    const dateDiv = document.createElement('div');
    dateDiv.className = 'issue_date';
    dateDiv.textContent = 'Submitted: ' + window.IssueTracker.utils.formatDate(issue.timestamp);

    leftDiv.appendChild(categoryDiv);
    leftDiv.appendChild(titleDiv);
    leftDiv.appendChild(descDiv);
    leftDiv.appendChild(dateDiv);

    // Right container with image
    const rightDiv = document.createElement('div');
    rightDiv.className = 'issue_container_right';

    if (issue.image) {
        const img = document.createElement('img');
        img.src = issue.image;
        img.alt = issue.title;
        img.className = 'issue_img';
        img.onerror = function() {
            this.style.display = 'none';
            const placeholder = createImagePlaceholder();
            rightDiv.appendChild(placeholder);
        };
        rightDiv.appendChild(img);
    } else {
        const placeholder = createImagePlaceholder();
        rightDiv.appendChild(placeholder);
    }

    issueDiv.appendChild(leftDiv);
    issueDiv.appendChild(rightDiv);

    issueDiv.addEventListener('click', function() {
        handleIssueClick(issue);
    });

    return issueDiv;
}

function createImagePlaceholder() {
    const placeholder = document.createElement('div');
    placeholder.className = 'issue_img_placeholder';
    
    // Create SVG icon for placeholder
    placeholder.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 24 24" fill="#205a4c" opacity="0.5">
            <path d="M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19M19,19H5V5H19M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z"/>
        </svg>
    `;
    
    return placeholder;
}

function showEmptyState() {
    issuesContainer.style.display = 'none';
    emptyState.style.display = 'block';

    const messageEl = emptyState.querySelector('p');
    if (currentFilter) {
        messageEl.textContent = `No issues found in the "${currentFilter}" category.`;
    } else {
        messageEl.textContent = 'There are currently no issues to display.';
    }
}

function showLoadingState() {
    loadingState.style.display = 'block';
    issuesContainer.style.display = 'none';
    emptyState.style.display = 'none';
}

function hideLoadingState() {
    loadingState.style.display = 'none';
}

function updateFilterInfo() {
    const existingInfo = document.querySelector('.filter-info');
    if (existingInfo) {
        existingInfo.remove();
    }

    
    if (currentFilter && filteredIssues.length > 0) {
        const filterInfo = document.createElement('div');
        filterInfo.className = 'filter-info';
        filterInfo.textContent = `Showing ${filteredIssues.length} issue(s) in "${currentFilter}" category`;
        
        issuesContainer.parentNode.insertBefore(filterInfo, issuesContainer);
    }
}

function handleUrlParams() {
    const urlParams = window.IssueTracker.utils.getUrlParams();
    if (urlParams.category && window.IssueTracker.config.categories.includes(urlParams.category)) {
        currentFilter = urlParams.category;
        categoryFilter.value = currentFilter;
        filterAndDisplayIssues();
    }
}

function handleIssueClick(issue) {
    console.log('Issue clicked:', issue);
}

function showError(message) {
    hideLoadingState();
    issuesContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #dc3545;">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" style="margin-bottom: 20px;">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
            <h3>Error</h3>
            <p>${message}</p>
            <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #205a4c; color: white; border: none; border-radius: 6px; cursor: pointer;">
                Retry
            </button>
        </div>
    `;
    issuesContainer.style.display = 'block';
}

window.addEventListener('storage', function(e) {
    if (e.key === window.IssueTracker.config.storageKey) {
        loadIssues();
    }
});

document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        loadIssues();
    }
});
});