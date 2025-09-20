// Dropdown handlers
const navChevron = document.getElementById('nav-chevron');
const navDropMenu = document.getElementById('nav-dropdown-menu');
const dayDropMenu = document.getElementById('day-dropdown-menu');
const dayChevron = document.getElementById('day-chevron');

navChevron.addEventListener('click', function () {
  if (navDropMenu.className === 'hidden') {
    navDropMenu.className = 'drop-menu';
  } else {
    navDropMenu.className = 'hidden';
  }
});

dayChevron.addEventListener('click', function () {
  if (dayDropMenu.className === 'hidden') {
    dayDropMenu.className = 'drop-menu';
  } else {
    dayDropMenu.className = 'hidden';
  }
});