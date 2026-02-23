
document.addEventListener('DOMContentLoaded', () => {
    const chapterList = document.getElementById('chapter-list');
    const lessonsMain = document.getElementById('lessons-main');
    const loading = document.getElementById('lessons-loading');
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    function bindChapterButtons() {
        const btns = document.querySelectorAll('.chapter-btn');
        const panels = document.querySelectorAll('.lesson-panel');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const ch = btn.dataset.chapter;
                btns.forEach(b => b.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                const chapterEl = document.getElementById(`chapter-${ch}`);
                if (chapterEl) chapterEl.classList.add('active');
                if (sidebar) sidebar.classList.remove('open');
                if (overlay) overlay.classList.remove('show');
            });
        });
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

    // fetch lessons from backend and render
    async function loadLessons() {
        try {
            const res = await fetch("https://strums-backend.onrender.com/api/lessons");
            if (!res.ok) throw new Error('Network response not ok');
            const lessons = await res.json();

            // clear loading
            if (loading) loading.remove();

            // populate sidebar
            lessons.forEach((ls, idx) => {
                const btn = document.createElement('button');
                btn.className = 'chapter-btn' + (idx === 0 ? ' active' : '');
                btn.dataset.chapter = ls.chapter;
                btn.innerHTML = `<span class="chapter-num">${ls.chapter}</span> ${ls.title}`;
                chapterList.appendChild(btn);
            });

            // populate main panels
            lessons.forEach((ls, idx) => {
                const panel = document.createElement('div');
                panel.className = 'lesson-panel' + (idx === 0 ? ' active' : '');
                panel.id = `chapter-${ls.chapter}`;

                const header = document.createElement('div');
                header.className = 'lesson-header';
                header.innerHTML = `<div class="lesson-tag">${ls.tag || ('Chapter ' + ls.chapter)}</div>
                                    <div class="lesson-title">${ls.title}</div>
                                    <div class="lesson-desc">${ls.description || ''}</div>`;
                panel.appendChild(header);

                const d = ls.data || {};
                if (d.infoCards) {
                    const cards = document.createElement('div');
                    cards.className = 'info-cards';
                    d.infoCards.forEach(c => {
                        const card = document.createElement('div');
                        card.className = 'info-card';
                        card.innerHTML = `<h4>${c.title}</h4><p>${c.text}</p>`;
                        cards.appendChild(card);
                    });
                    panel.appendChild(cards);
                }

                if (d.stringNames) {
                    const st = document.createElement('div');
                    st.className = 'section-title';
                    st.textContent = 'String Names';
                    panel.appendChild(st);
                    const tip = document.createElement('div');
                    tip.className = 'tip-box';
                    tip.innerHTML = d.stringNames;
                    panel.appendChild(tip);
                }

                if (d.keyTerms) {
                    const st = document.createElement('div');
                    st.className = 'section-title';
                    st.textContent = 'Key Terms';
                    panel.appendChild(st);
                    const ul = document.createElement('ul');
                    ul.className = 'step-list';
                    d.keyTerms.forEach(kt => {
                        const li = document.createElement('li');
                        li.innerHTML = `<span class="step-num">→</span><span><strong>${kt.term}</strong> : ${kt.text}</span>`;
                        ul.appendChild(li);
                    });
                    panel.appendChild(ul);
                }

                if (d.pattern) {
                    const st = document.createElement('div');
                    st.className = 'section-title';
                    st.textContent = 'Pattern';
                    panel.appendChild(st);
                    const tip = document.createElement('div');
                    tip.className = 'tip-box';
                    tip.innerHTML = d.pattern;
                    panel.appendChild(tip);
                }

                if (d.practice) {
                    const st = document.createElement('div');
                    st.className = 'section-title';
                    st.textContent = 'Practice Steps';
                    panel.appendChild(st);
                    const ul = document.createElement('ul');
                    ul.className = 'step-list';
                    d.practice.forEach((p, i) => {
                        const li = document.createElement('li');
                        li.innerHTML = `<span class="step-num">${i+1}</span><span>${p}</span>`;
                        ul.appendChild(li);
                    });
                    panel.appendChild(ul);
                }

                if (d.chords) {
                    const grid = document.createElement('div');
                    grid.className = 'chord-grid';
                    d.chords.forEach(c => {
                        const card = document.createElement('div');
                        card.className = 'chord-card';
                        card.innerHTML = `<div class="chord-name">${c.name}</div><div class="chord-hint">${c.hint}</div>`;
                        grid.appendChild(card);
                    });
                    panel.appendChild(grid);
                }

                if (d.tips) {
                    const st = document.createElement('div');
                    st.className = 'section-title';
                    st.textContent = 'Tips for Clean Chords';
                    panel.appendChild(st);
                    const ul = document.createElement('ul');
                    ul.className = 'step-list';
                    d.tips.forEach((p, i) => {
                        const li = document.createElement('li');
                        li.innerHTML = `<span class="step-num">${i+1}</span><span>${p}</span>`;
                        ul.appendChild(li);
                    });
                    panel.appendChild(ul);
                }

                if (d.challenge) {
                    const tip = document.createElement('div');
                    tip.className = 'tip-box';
                    tip.innerHTML = `<strong>Song Challenge:</strong> ${d.challenge}`;
                    panel.appendChild(tip);
                }

                if (d.progressions) {
                    const st = document.createElement('div');
                    st.className = 'section-title';
                    st.textContent = 'Practice Progressions';
                    panel.appendChild(st);
                    const ul = document.createElement('ul');
                    ul.className = 'step-list';
                    d.progressions.forEach((p, i) => {
                        const li = document.createElement('li');
                        li.innerHTML = `<span class="step-num">${i+1}</span><span>${p}</span>`;
                        ul.appendChild(li);
                    });
                    panel.appendChild(ul);
                }

                if (d.tip) {
                    const tipBox = document.createElement('div');
                    tipBox.className = 'tip-box';
                    tipBox.innerHTML = `<strong>Pro tip:</strong> ${d.tip}`;
                    panel.appendChild(tipBox);
                }

                lessonsMain.appendChild(panel);
            });

            bindChapterButtons();
        } catch (err) {
            console.error('Failed to load lessons', err);
        }
    }

    loadLessons();
});

