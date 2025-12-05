const toggleButton = document.getElementById('theme-toggle');

// check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark-mode');
}

// toggle function
document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle');
    if (toggleButton) {
        toggleButton.textContent = document.documentElement.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';

        toggleButton.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark-mode');
            const isDark = document.documentElement.classList.contains('dark-mode');
            toggleButton.textContent = isDark ? 'Light Mode' : 'Dark Mode';
            
            // save preference
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
});