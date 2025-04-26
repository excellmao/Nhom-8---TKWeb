// Toggles the mobile navigation menu
function toggleMenu() {
const navTabs = document.getElementById('nav-tabs');
navTabs.classList.toggle('show');
}

// Hides the menu when clicking outside of it
document.addEventListener('click', function (event) {
const navTabs = document.getElementById('nav-tabs');
const menuButton = document.querySelector('.menu-button');

// Check if the click is outside the nav-tabs and menu-button
if (!navTabs.contains(event.target) && !menuButton.contains(event.target)) {
    navTabs.classList.remove('show');
}
});