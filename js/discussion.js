// Simple client-side discussion board using hashtags

const data = JSON.parse(localStorage.getItem('discussionData') || '{}');

const tagsList = document.getElementById('tagsList');
const commentsList = document.getElementById('commentsList');
const commentInput = document.getElementById('commentInput');
const submitBtn = document.getElementById('submitComment');
const currentTagTitle = document.getElementById('currentTagTitle');
let currentTag = null;

function save() {
  localStorage.setItem('discussionData', JSON.stringify(data));
}

function renderTags() {
  tagsList.innerHTML = '';
  Object.keys(data).forEach(tag => {
    const li = document.createElement('li');
    li.textContent = `#${tag} (${data[tag].votes || 0})`;
    if (tag === currentTag) li.classList.add('active');
    li.addEventListener('click', () => selectTag(tag));

    const btn = document.createElement('button');
    btn.textContent = 'Solved?';
    btn.addEventListener('click', e => {
      e.stopPropagation();
      data[tag].votes = (data[tag].votes || 0) + 1;
      if (data[tag].votes >= 5) {
        delete data[tag];
        if (currentTag === tag) {
          currentTag = null;
          currentTagTitle.textContent = 'Select a hashtag';
          commentsList.innerHTML = '';
        }
      }
      save();
      renderTags();
      if (currentTag === tag && data[tag]) {
        renderComments(tag);
      }
    });

    li.appendChild(btn);
    tagsList.appendChild(li);
  });
}

function selectTag(tag) {
  currentTag = tag;
  currentTagTitle.textContent = `#${tag} Discussion`;
  renderTags();
  renderComments(tag);
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
    if (!data[tag]) data[tag] = { comments: [], votes: 0 };
    data[tag].comments.push(text);
  });
  save();
  commentInput.value = '';
  renderTags();
  if (currentTag && data[currentTag]) renderComments(currentTag);
});

renderTags();
