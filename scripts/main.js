const toggleButton = document.getElementById('theme-toggle');
const body = document.body;

// check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    //    toggleButton.textContent = 'Light Mode';
}

   // toggle function
document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle');
    if (toggleButton) {
        toggleButton.textContent = body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';

        toggleButton.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            toggleButton.textContent = isDark ? 'Light Mode' : 'Dark Mode';
            
            // save preference
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
     }
});
   