const data = JSON.parse(localStorage.getItem('discussionData') || '{}');

const tagsList = document.getElementById('tagsList');
const commentsList = document.getElementById('commentsList');
const commentInput = document.getElementById('commentInput');
const submitBtn = document.getElementById('submitComment');
const currentTagTitle = document.getElementById('currentTagTitle');
let currentTag = null;
const statuses = ['reported', 'investigating', 'resolved'];

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function save() {
    localStorage.setItem('discussionData', JSON.stringify(data));
}

function renderTags() {
    tagsList.innerHTML = '';
    Object.keys(data).forEach(tag => {
        if (!data[tag].status) data[tag].status = 'reported';
        const li = document.createElement('li');
        if (tag === currentTag) li.classList.add('active');
        li.addEventListener('click', () => selectTag(tag));

        const infoDiv = document.createElement('div');
        infoDiv.className = 'tag_info';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = `#${tag} (${data[tag].votes || 0})`;

        const statusSpan = document.createElement('span');
        statusSpan.className = `status_label status-${data[tag].status}`;
        statusSpan.textContent = capitalize(data[tag].status);
        statusSpan.addEventListener('click', e => {
            e.stopPropagation();
            const idx = statuses.indexOf(data[tag].status);
            data[tag].status = statuses[(idx + 1) % statuses.length];
            save();
            renderTags();
            if (currentTag === tag) updateCurrentTagTitle(tag);
        });

        infoDiv.appendChild(nameSpan);
        infoDiv.appendChild(statusSpan);

        const btn = document.createElement('button');
        btn.textContent = 'Solved?';
        btn.addEventListener('click', e => {
            e.stopPropagation();
            data[tag].votes = (data[tag].votes || 0) + 1;
            if (data[tag].votes >= 5) {
                delete data[tag];
                if (currentTag === tag) {
                    currentTag = null;
                    commentsList.innerHTML = '';
                    updateCurrentTagTitle(null);
                }
            }
            save();
            renderTags();
            if (currentTag === tag && data[tag]) {
                renderComments(tag);
            }
        });

        li.appendChild(infoDiv);
        li.appendChild(btn);
        tagsList.appendChild(li);
    });
}

function selectTag(tag) {
    currentTag = tag;
    renderTags();
    renderComments(tag);
    updateCurrentTagTitle(tag);
}

function renderComments(tag) {
    const comments = data[tag]?.comments || [];
    commentsList.innerHTML = '';
    comments.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        commentsList.appendChild(li);
    });
}

submitBtn.addEventListener('click', () => {
    const text = commentInput.value.trim();
    if (!text) return;
    const matches = [...text.matchAll(/#(\w+)/g)];
    if (matches.length === 0) return;
    matches.forEach(m => {
            const tag = m[1];
            if (!data[tag]) data[tag] = { comments: [], votes: 0, status: 'reported' };
            data[tag].comments.push(text);
    });
    save();
    commentInput.value = '';
    renderTags();
    updateCurrentTagTitle(currentTag);
    if (currentTag && data[currentTag]) renderComments(currentTag);
});

function updateCurrentTagTitle(tag) {
    if (tag) {
        const status = data[tag]?.status || 'reported';
        currentTagTitle.innerHTML = `#${tag} Discussion - <span class="status_label status-${status}">${capitalize(status)}</span>`;
    } else {
        currentTagTitle.textContent = 'Select a hashtag';
    }
}

renderTags();
updateCurrentTagTitle(currentTag);