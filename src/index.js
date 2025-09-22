// Dropdown handlers
const navChevron = document.getElementById('nav-chevron');
const navDropMenu = document.getElementById('nav-dropdown-menu');
const dayDropMenu = document.getElementById('day-dropdown-menu');
const dayChevron = document.getElementById('day-chevron');

navChevron.addEventListener('click', function () {
  if (navDropMenu.className === 'menu') {
    navDropMenu.classList.add('drop-menu');
  } else {
    navDropMenu.classList.remove('drop-menu');
  }
});

dayChevron.addEventListener('click', function () {
  if (dayDropMenu.className === 'menu') {
    dayDropMenu.classList.add('drop-menu');
  } else {
    dayDropMenu.classList.remove('drop-menu');
  }
});