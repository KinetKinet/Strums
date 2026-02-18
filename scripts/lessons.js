
const btns = document.querySelectorAll('.chapter-btn');
const panels = document.querySelectorAll('.lesson-panel');
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

btns.forEach(btn => {
    btn.addEventListener('click', () => {
    const ch = btn.dataset.chapter;
    btns.forEach(b => b.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`chapter-${ch}`).classList.add('active');
    // close sidebar on mobile
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    });
});

hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
});

overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
});

