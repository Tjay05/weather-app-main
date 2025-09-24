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

// Location declarations
const currentLocation = document.getElementById('location');
const currentTime = document.getElementById('time');
const currentTemp = document.getElementById('current-temp');
const currentHum = document.getElementById('current-humidity');
const currentWind = document.getElementById('current-wind');
const currentPrecp = document.getElementById('current-precip');

// Tumezone formatter 
const formatTz = (tz) => {
  const [region, city] = tz.split("/");
  return `${city.replace(/_/g, " ")}, ${region}`;
};

// Date format function
const formatDate = (rawDate) => {
  const date = new Date(rawDate);
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}

// Imperial fetch function
window.onload = () => {
  fetchData();
}

const fetchData = async () => {
  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=9.9285&longitude=8.8921&daily=weather_code,apparent_temperature_max,apparent_temperature_min&hourly=apparent_temperature,weather_code&current=relative_humidity_2m,precipitation,wind_speed_10m,apparent_temperature,weather_code&timezone=auto&wind_speed_unit=mph&precipitation_unit=inch');
    const data = await res.json();
    if (res.ok) {
      currentLocation.innerHTML = formatTz(data.timezone);
      currentTime.innerHTML = formatDate(data.current.time);
      currentTemp.innerHTML = data.current.apparent_temperature + '°';
      currentHum.innerHTML = data.current.relative_humidity_2m + '%';
      currentWind.innerHTML = data.current.wind_speed_10m + ' mph';
      currentPrecp.innerHTML = Math.round(data.current.precipitation * 100)/100 + ' in';
    }
  } catch (error) {
    console.log(error);
  }
}


// const fetchData = () => {
//   fetch('https://api.open-meteo.com/v1/forecast?latitude=9.9285&longitude=8.8921&daily=weather_code,apparent_temperature_max,apparent_temperature_min&hourly=apparent_temperature,weather_code&current=relative_humidity_2m,precipitation,wind_speed_10m,apparent_temperature,weather_code&timezone=auto&wind_speed_unit=mph&precipitation_unit=inch')
//     .then(function(res){
//       return res.json()
//     })
//     .then(function(data){
//       console.log(data.timezone)
//     })
//     .catch(function(err){
//       console.log(err)
//     })
// }