// Dropdown handlers
const navChevron = document.getElementById('nav-chevron');
const navDropMenu = document.getElementById('nav-dropdown-menu');
const dayDropMenu = document.getElementById('day-dropdown-menu');
const dayChevron = document.getElementById('day-chevron');

// Search handler
const search = document.getElementById('search');
const searchDrop = document.getElementById('search-dropdown-menu');

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

search.addEventListener('click', () => {
  if (searchDrop.className === 'search-menu') {
    searchDrop.classList.add('drop-menu');
  } else {
    searchDrop.classList.remove('drop-menu');
  }
})