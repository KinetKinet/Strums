import { apiJson } from './api-client.js';
import { getAuthHeaders, isAdminLoggedIn } from './admin-auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const chapterList = document.getElementById('chapter-list');
  const lessonsMain = document.getElementById('lessons-main');
  const loading = document.getElementById('lessons-loading');
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  if (!chapterList || !lessonsMain) {
    return;
  }

  let lessonsCache = [];
  let activeChapter = null;

  function bindChapterButtons() {
    const btns = document.querySelectorAll('.chapter-btn');
    const panels = document.querySelectorAll('.lesson-panel');

    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const chapter = btn.dataset.chapter;
        activeChapter = Number(chapter);

        btns.forEach((b) => b.classList.remove('active'));
        panels.forEach((p) => p.classList.remove('active'));

        btn.classList.add('active');
        const chapterEl = document.getElementById(`chapter-${chapter}`);
        if (chapterEl) chapterEl.classList.add('active');

        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
      });
    });
  }

  function lessonEditorTemplate(lesson) {
    const dataJson = JSON.stringify(lesson.data || {}, null, 2);

    return `
      <div class="admin-edit-wrap">
        <button class="admin-edit-toggle" data-lesson-toggle="${lesson._id}" type="button">Edit Lesson</button>
        <div class="admin-edit-form" id="lesson-editor-${lesson._id}" hidden>
          <label>Chapter <input type="number" id="edit-chapter-${lesson._id}" value="${lesson.chapter || ''}" /></label>
          <label>Tag <input type="text" id="edit-tag-${lesson._id}" value="${lesson.tag || ''}" /></label>
          <label>Title <input type="text" id="edit-title-${lesson._id}" value="${lesson.title || ''}" /></label>
          <label>Description <textarea id="edit-description-${lesson._id}">${lesson.description || ''}</textarea></label>
          <label>Video URL <input type="text" id="edit-video-${lesson._id}" value="${lesson.videoUrl || ''}" /></label>
          <label>Data JSON <textarea id="edit-data-${lesson._id}" class="admin-json">${dataJson}</textarea></label>
          <div class="admin-edit-actions">
            <button type="button" data-lesson-save="${lesson._id}">Save</button>
            <span id="lesson-save-msg-${lesson._id}" class="admin-edit-msg"></span>
          </div>
        </div>
      </div>
    `;
  }

  function renderLessons() {
    chapterList.innerHTML = '';
    lessonsMain.innerHTML = '';

    const loggedIn = isAdminLoggedIn();

    lessonsCache.forEach((lesson, idx) => {
      const btn = document.createElement('button');
      const isActive = activeChapter ? Number(lesson.chapter) === activeChapter : idx === 0;

      btn.className = `chapter-btn${isActive ? ' active' : ''}`;
      btn.dataset.chapter = lesson.chapter;
      btn.innerHTML = `<span class="chapter-num">${lesson.chapter}</span> ${lesson.title}`;
      chapterList.appendChild(btn);

      const panel = document.createElement('div');
      panel.className = `lesson-panel${isActive ? ' active' : ''}`;
      panel.id = `chapter-${lesson.chapter}`;

      const header = document.createElement('div');
      header.className = 'lesson-header';
      header.innerHTML = `<div class="lesson-tag">${lesson.tag || `Chapter ${lesson.chapter}`}</div>
                          <div class="lesson-title">${lesson.title}</div>
                          <div class="lesson-desc">${lesson.description || ''}</div>`;
      panel.appendChild(header);

      const data = lesson.data || {};
      if (data.infoCards) {
        const cards = document.createElement('div');
        cards.className = 'info-cards';
        data.infoCards.forEach((cardData) => {
          const card = document.createElement('div');
          card.className = 'info-card';
          card.innerHTML = `<h4>${cardData.title}</h4><p>${cardData.text}</p>`;
          cards.appendChild(card);
        });
        panel.appendChild(cards);
      }

      if (data.stringNames) {
        const title = document.createElement('div');
        title.className = 'section-title';
        title.textContent = 'String Names';
        panel.appendChild(title);

        const tip = document.createElement('div');
        tip.className = 'tip-box';
        tip.innerHTML = data.stringNames;
        panel.appendChild(tip);
      }

      if (data.keyTerms) {
        const title = document.createElement('div');
        title.className = 'section-title';
        title.textContent = 'Key Terms';
        panel.appendChild(title);

        const list = document.createElement('ul');
        list.className = 'step-list';
        data.keyTerms.forEach((keyTerm) => {
          const li = document.createElement('li');
          li.innerHTML = `<span class="step-num">-></span><span><strong>${keyTerm.term}</strong> : ${keyTerm.text}</span>`;
          list.appendChild(li);
        });
        panel.appendChild(list);
      }

      if (data.pattern) {
        const title = document.createElement('div');
        title.className = 'section-title';
        title.textContent = 'Pattern';
        panel.appendChild(title);

        const tip = document.createElement('div');
        tip.className = 'tip-box';
        tip.innerHTML = data.pattern;
        panel.appendChild(tip);
      }

      if (data.videoUrl) {
        const title = document.createElement('div');
        title.className = 'section-title';
        title.textContent = 'Video';
        panel.appendChild(title);

        const videoWrap = document.createElement('div');
        videoWrap.className = 'video-wrap';
        const video = document.createElement('video');
        video.controls = true;
        video.src = data.videoUrl;
        video.className = 'lesson-video';
        video.setAttribute('playsinline', '');
        videoWrap.appendChild(video);
        panel.appendChild(videoWrap);
      }

      if (data.practice) {
        const title = document.createElement('div');
        title.className = 'section-title';
        title.textContent = 'Practice Steps';
        panel.appendChild(title);

        const list = document.createElement('ul');
        list.className = 'step-list';
        data.practice.forEach((practice, i) => {
          const li = document.createElement('li');
          li.innerHTML = `<span class="step-num">${i + 1}</span><span>${practice}</span>`;
          list.appendChild(li);
        });
        panel.appendChild(list);
      }

      if (data.chords) {
        const grid = document.createElement('div');
        grid.className = 'chord-grid';
        data.chords.forEach((chord) => {
          const card = document.createElement('div');
          card.className = 'chord-card';
          card.innerHTML = `<div class="chord-name">${chord.name}</div><div class="chord-hint">${chord.hint}</div>`;
          grid.appendChild(card);
        });
        panel.appendChild(grid);
      }

      if (data.tips) {
        const title = document.createElement('div');
        title.className = 'section-title';
        title.textContent = 'Tips for Clean Chords';
        panel.appendChild(title);

        const list = document.createElement('ul');
        list.className = 'step-list';
        data.tips.forEach((tipItem, i) => {
          const li = document.createElement('li');
          li.innerHTML = `<span class="step-num">${i + 1}</span><span>${tipItem}</span>`;
          list.appendChild(li);
        });
        panel.appendChild(list);
      }

      if (data.challenge) {
        const tip = document.createElement('div');
        tip.className = 'tip-box';
        tip.innerHTML = `<strong>Song Challenge:</strong> ${data.challenge}`;
        panel.appendChild(tip);
      }

      if (data.progressions) {
        const title = document.createElement('div');
        title.className = 'section-title';
        title.textContent = 'Practice Progressions';
        panel.appendChild(title);

        const list = document.createElement('ul');
        list.className = 'step-list';
        data.progressions.forEach((progression, i) => {
          const li = document.createElement('li');
          li.innerHTML = `<span class="step-num">${i + 1}</span><span>${progression}</span>`;
          list.appendChild(li);
        });
        panel.appendChild(list);
      }

      if (data.tip) {
        const tipBox = document.createElement('div');
        tipBox.className = 'tip-box';
        tipBox.innerHTML = `<strong>Pro tip:</strong> ${data.tip}`;
        panel.appendChild(tipBox);
      }

      if (loggedIn && lesson._id) {
        const adminArea = document.createElement('div');
        adminArea.innerHTML = lessonEditorTemplate(lesson);
        panel.appendChild(adminArea);
      }

      lessonsMain.appendChild(panel);
    });

    bindChapterButtons();
    bindAdminEditors();
  }

  function bindAdminEditors() {
    if (!isAdminLoggedIn()) {
      return;
    }

    document.querySelectorAll('[data-lesson-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-lesson-toggle');
        const editor = document.getElementById(`lesson-editor-${id}`);
        if (editor) {
          editor.hidden = !editor.hidden;
        }
      });
    });

    document.querySelectorAll('[data-lesson-save]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-lesson-save');
        const msg = document.getElementById(`lesson-save-msg-${id}`);

        try {
          const payload = {
            chapter: Number(document.getElementById(`edit-chapter-${id}`).value),
            tag: document.getElementById(`edit-tag-${id}`).value,
            title: document.getElementById(`edit-title-${id}`).value,
            description: document.getElementById(`edit-description-${id}`).value,
            videoUrl: document.getElementById(`edit-video-${id}`).value,
            data: JSON.parse(document.getElementById(`edit-data-${id}`).value || '{}'),
          };

          await apiJson(`/api/lessons/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeaders(),
            },
            body: JSON.stringify(payload),
          });

          if (msg) msg.textContent = 'Saved';
          await loadLessons();
        } catch (err) {
          if (msg) msg.textContent = err.message || 'Save failed';
        }
      });
    });
  }

  async function loadLessons() {
    try {
      const lessons = await apiJson('/api/lessons');
      lessonsCache = Array.isArray(lessons) ? lessons : [];

      if (!activeChapter && lessonsCache[0]) {
        activeChapter = Number(lessonsCache[0].chapter);
      }

      if (loading) loading.remove();
      renderLessons();
    } catch (err) {
      console.error('Failed to load lessons', err);
      if (loading) loading.textContent = 'Unable to load lessons right now.';
    }
  }

  if (hamburger && sidebar && overlay) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }

  loadLessons();
});
