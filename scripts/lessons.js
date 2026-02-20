
document.addEventListener('DOMContentLoaded', () => {
    const btns = document.querySelectorAll('.chapter-btn');
    const panels = document.querySelectorAll('.lesson-panel');
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    if (btns.length > 0) {
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const ch = btn.dataset.chapter;
                btns.forEach(b => b.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                const chapterEl = document.getElementById(`chapter-${ch}`);
                if (chapterEl) chapterEl.classList.add('active');
                // close sidebar on mobile
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
});

