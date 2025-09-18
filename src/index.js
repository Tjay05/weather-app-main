const chevron = document.getElementById('chevron');
const dropMenu = document.getElementById('dropdown-menu');

chevron.addEventListener('click', function () {
  if (dropMenu.className === 'hidden') {
    dropMenu.className = 'drop-menu'
  } else {
    dropMenu.className = 'hidden'
  }
})