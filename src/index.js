// Dropdown handlers
const navChevron = document.getElementById('nav-chevron');
const navDropMenu = document.getElementById('nav-dropdown-menu');
const daySelector = document.getElementById('day-selector');

// Search handler
const search = document.getElementById('search');
const searchDrop = document.getElementById('search-dropdown-menu');

navChevron.addEventListener('click', function () {
  if (navDropMenu.className === 'menu') {
    navChevron.style.outlineWidth = '2px';
    navChevron.style.outlineOffset = '2px';
    navChevron.style.outlineStyle = 'solid';
    navDropMenu.classList.add('drop-menu');
  } else {
    navDropMenu.classList.remove('drop-menu');
    navChevron.style.outlineStyle = 'unset';
  }
});

// daySelector.addEventListener('click', function () {});

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
const currentFeel = document.getElementById('current-feel');
const currentHum = document.getElementById('current-humidity');
const currentWind = document.getElementById('current-wind');
const currentPrecp = document.getElementById('current-precip');

// daily 
const dailyForecastContainer = document.getElementById('daily-forecast');

// Hourly
const hourlyForecastContainer = document.getElementById('hourly-forecast');

const imperialUrl = 'https://api.open-meteo.com/v1/forecast?latitude=9.9285&longitude=8.8921&daily=weather_code,apparent_temperature_max,apparent_temperature_min&hourly=apparent_temperature,weather_code&current=relative_humidity_2m,precipitation,wind_speed_10m,apparent_temperature,weather_code,temperature_2m&timezone=auto&wind_speed_unit=mph&precipitation_unit=inch';

// Timezone formatter 
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

// Weather icon selector
const selectWeatherIcon = (wc) => {
  wc = Number(wc);
  let src;

  if (wc === 0) {
    src = '../assets/images/icon-sunny.webp';
  } else if (wc === 1 || wc === 2) {
    src = '../assets/images/icon-partly-cloudy.webp';
  } else if (wc === 3) {
    src = '../assets/images/icon-overcast.webp';
  } else if (wc === 45 || wc === 48) {
    src = '../assets/images/icon-fog.webp';
  } else if (wc >= 51 && wc <= 57) {
    src = '../assets/images/icon-drizzle.webp';
  } else if (wc >= 61 && wc <= 67) {
    src = '../assets/images/icon-rain.webp';
  } else if (wc >= 71 && wc <= 77) {
    src = '../assets/images/icon-snow.webp';
  } else if (wc >= 80 && wc <= 82) {
    src = '../assets/images/icon-rain.webp';
  } else if (wc === 85 || wc === 86) {
    src = '../assets/images/icon-snow.webp';
  } else if (wc >= 95) {
    src = '../assets/images/icon-storm.webp';
  }

  return src;
};

// Imperial fetch function
window.onload = () => {
  fetchData(imperialUrl);
}

let hourlyData = null;

const fetchData = async (url) => {
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (res.ok) {
      // Current forecast
      currentLocation.innerHTML = formatTz(data.timezone);
      currentTime.innerHTML = formatDate(data.current.time);
      currentTemp.innerHTML = `${data.current.temperature_2m.toFixed(0)} `;
      currentFeel.innerHTML = `${data.current.apparent_temperature} °`;
      currentHum.innerHTML = `${data.current.relative_humidity_2m} %`;
      currentWind.innerHTML = `${data.current.wind_speed_10m} mph`;
      currentPrecp.innerHTML = `${Math.round(data.current.precipitation * 100)/100} in`;

      // Daily Forecast
      const dailyDays = data.daily.time;
      const dailyWeatherCode = data.daily.weather_code;
      const dailyAppTempMin = data.daily.apparent_temperature_min;
      const dailyAppTempMax = data.daily.apparent_temperature_max;

      const dailyForecastHtml = await dailyDays.map((dateString, i) => {
        const date = new Date(dateString);
        const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
        const weatherType = dailyWeatherCode[i];

        return `
          <div class="flex flex-col items-center bg-tneutral-800 rounded-2xl p-4 border-1 border-tneutral-600 min-h-[168px]">
            <p class="text-lg">${weekday}</p>
            <img src=${selectWeatherIcon(weatherType)} alt="" class="daily-icon">
            <div class="flex justify-between items-center text-lg self-stretch mt-3">
              <p class="text-tneutral-200">${dailyAppTempMax[i].toFixed(0)}°</p>
              <p class="text-tneutral-300">${dailyAppTempMin[i].toFixed(0)}°</p>
            </div>
          </div>
        `;
      });

      dailyForecastContainer.innerHTML = dailyForecastHtml.join("");

      // Hourly Forecast
      hourlyData = data.hourly;
      buildDay(data.hourly.time);
      renderHourly(new Date().toISOString().split('T')[0]);
    }
  } catch (error) {
    console.log(error);
  }
};

const buildDay = (times) => {
  const days = [...new Set(times.map(t => t.split('T')[0]))];

  daySelector.innerHTML = days
    .map(d => {
      const dateObj = new Date(d);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
      return `<option value=${d}>${dayName}</option>`
    })
    .join("");

  daySelector.onchange = () => renderHourly(daySelector.value);
}

const renderHourly = (selectedDay) => {
  const times = hourlyData.time;
  const temps = hourlyData.apparent_temperature;
  const codes = hourlyData.weather_code;

  const items = times
    .map((time, i) => ({
      time,
      temp: temps[i],
      code: codes[i],
    }))
    .filter(item => item.time.startsWith(selectedDay));

  const now = new Date();
  let filteredItems = items;

  if (selectedDay === now.toISOString().split("T")[0]) {
    filteredItems = items.filter(it => new Date(it.time) >= now).slice(0, 8);
  }

  hourlyForecastContainer.innerHTML = filteredItems.map(item => {
    const hour = new Date(item.time).toLocaleTimeString([], {
      hour: 'numeric',
      hour12: true,
    });
    
    return `
      <div class="flex items-center justify-between rounded-lg bg-tneutral-700 px-3 py-2 border-1 border-tneutral-600 min-h-[56px]">
        <div class="flex items-center gap-2">
          <img src=${selectWeatherIcon(item.code)} alt="" class="w-[13%]">
          <p class="text-lg">${hour}</p>
        </div>
        <p class="text-tneutral-300 font-medium">${item.temp.toFixed(0)}°</p>
      </div>
    `;
  }).join("");
}