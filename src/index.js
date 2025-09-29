// Element selector
const $ = (id) => document.getElementById(id);

// Toggle dropdown utility
const toggleDropdown = (trigger, menu, activeClass = "drop-menu", outline = false) => {
  trigger.addEventListener("click", () => {
    menu.classList.toggle(activeClass);

    if (outline) trigger.style.outlineStyle = menu.classList.contains(activeClass) ? "solid"  : "unset";
  });
};

// Format full date
const formatDate = (rawDate) => {
  return new Date(rawDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format hour
const formatHour = (time) =>
  new Date(time).toLocaleTimeString([], { hour: "numeric", hour12: true });

// Weather Helpers
const WEATHER_ICONS = {
  0: "icon-sunny.webp",
  1: "icon-partly-cloudy.webp",
  2: "icon-partly-cloudy.webp",
  3: "icon-overcast.webp",
  45: "icon-fog.webp",
  48: "icon-fog.webp",
  51: "icon-drizzle.webp",
  53: "icon-drizzle.webp",
  55: "icon-drizzle.webp",
  56: "icon-drizzle.webp",
  57: "icon-drizzle.webp",
  61: "icon-rain.webp",
  63: "icon-rain.webp",
  65: "icon-rain.webp",
  66: "icon-rain.webp",
  67: "icon-rain.webp",
  71: "icon-snow.webp",
  73: "icon-snow.webp",
  75: "icon-snow.webp",
  77: "icon-snow.webp",
  80: "icon-rain.webp",
  81: "icon-rain.webp",
  82: "icon-rain.webp",
  85: "icon-snow.webp",
  86: "icon-snow.webp",
  95: "icon-storm.webp",
  96: "icon-storm.webp",
  99: "icon-storm.webp",
};

const getWeatherIcon = (wc) =>
  `./assets/images/${WEATHER_ICONS[wc] || "icon-overcast.webp"}`;

// DOM Elements
const navChevron = $("nav-chevron");
const navDropMenu = $("nav-dropdown-menu");
const daySelector = $("day-selector");

const errorContainer = $("error-section");
const retryBtn = $("api-btn");
const errorMssg = $("api-error");
const mainContainer = $("main-content");

const searchInput = $("search-input");
const searchBtn = $("search-button");
const searchDrop = $("search-dropdown-menu");

const noResult = $("no-results");
const searchSect = $("search-section");
const containersSec = $("pageSec");
const locationContainer = $("location-container");
const loadingContainer = $("loading-container");

const currentLocation = $("location");
const currentIcon = $("location-icon");
const currentTime = $("time");
const currentTemp = $("current-temp");
const currentFeel = $("current-feel");
const currentHum = $("current-humidity");
const currentWind = $("current-wind");
const currentPrecp = $("current-precip");

const dailyForecastContainer = $("daily-forecast");
const hourlyForecastContainer = $("hourly-forecast");

// Dropdown Initializers
toggleDropdown(navChevron, navDropMenu, "drop-menu", true);

// Match width
function matchWidth () {
  searchDrop.style.width = searchInput.offsetWidth + "px";
}

// Weather Data Fetching
// default location Germany/Berlin
let defLat = 52.5244;
let defLong = 13.4105;

// LOCATION SUGGESTIONS
// fetch as user types
searchInput.addEventListener("input", async () => {
  const value = searchInput.value.trim();
  if (value.length < 2) {
    searchDrop.innerHTML = "";
    return;
  }

  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${value}&count=3`);
  const data = await res.json();

  if (data.results) {
    searchDrop.innerHTML = data.results
      .slice(0,3)
      .map(result => `<li data-lat="${result.latitude}" data-long="${result.longitude}" data-name="${result.name}, ${result.country}" class="p-1 rounded-lg px-2 cursor-pointer hover:bg-tneutral-700 border-1 border-transparent hover:border-tneutral-600">${result.name}, ${result.country}</li>`)
      .join("");
  }
});

// handle click on suggestion
searchDrop.addEventListener("click", (e) => {
  hideNoResult();

  if (e.target.tagName === 'LI') {
    const lat = e.target.dataset.lat;
    const long = e.target.dataset.long;
    const name = e.target.dataset.name;
    
    searchInput.value = e.target.textContent;
    searchDrop.innerHTML = "";
    fetchData(lat, long, name);
  }
});

// Handle serachBtn click
searchBtn.addEventListener('click', async () => {
  hideNoResult();
  const value = searchInput.value.trim();
  if (!value) return ;

  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${value}&count=1`);
  const data = await res.json();
  
  if (data.results && data.results.length > 0) {
    const { latitude, longitude, name, country } = data.results[0];
    fetchData(latitude, longitude, `${name}, ${country}`);
  } else {
    showNoResult();
  }
})

let hourlyData = null;
let lastRequest = null;

const fetchData = async (lat, long, city) => {
  lastRequest = { lat, long, city };

  try {
    showLoader();
    hideErrorMssg();

    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=weather_code,apparent_temperature_max,apparent_temperature_min&hourly=apparent_temperature,weather_code&current=relative_humidity_2m,precipitation,wind_speed_10m,apparent_temperature,weather_code,temperature_2m&timezone=auto&wind_speed_unit=mph&precipitation_unit=inch`);
    const data = await res.json();

    if (!res.ok) throw new Error("API call failed");

    currentLocation.textContent = city;

    renderCurrent(data.current, data.timezone);
    renderDaily(data.daily);
    hourlyData = data.hourly;

    buildDaySelector(hourlyData.time);
    renderHourly(getToday());
  } catch (err) {
    showErrorMssg(err);
    // console.error(err);
  } finally {
    hideLoader();
  }
};

// Rendering Functions
const showLoader = () => {
  loadingContainer.classList.remove('hidden');
  locationContainer.classList.add('hidden');
};

const hideLoader = () => {
  loadingContainer.classList.add('hidden');
  locationContainer.classList.remove('hidden');
  locationContainer.classList.add('md:flex');
};

const showErrorMssg = (err) => {
  mainContainer.classList.add('hidden');
  errorMssg.textContent = err;
  errorContainer.classList.remove('hidden');
};

const hideErrorMssg = () => {
  errorContainer.classList.add('hidden');
  errorMssg.textContent = "";
  mainContainer.classList.remove('hidden');
};

const showNoResult =  () => {
  searchDrop.innerHTML = "";
  noResult.classList.remove('hidden');
  containersSec.classList.remove('md:grid');
  containersSec.classList.add('hidden');
};

const hideNoResult =  () => {
  noResult.classList.add('hidden');
  containersSec.classList.remove('hidden');
  containersSec.classList.add('md:grid');
};

const renderCurrent = (current) => {
  currentIcon.setAttribute("src", getWeatherIcon(current.weather_code));
  currentTime.textContent = formatDate(current.time);
  currentTemp.textContent = `${Math.round(current.temperature_2m)} `;
  currentFeel.textContent = `${Math.round(current.apparent_temperature)}°`;
  currentHum.textContent = `${current.relative_humidity_2m}%`;
  currentWind.textContent = `${Math.round(current.wind_speed_10m)} mph`;
  currentPrecp.textContent = `${(Math.round(current.precipitation * 100) / 100)} in`;
};

const renderDaily = (daily) => {
  dailyForecastContainer.innerHTML = daily.time
    .map((date, i) => {
      const weekday = new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
      });

      return `
        <div class="flex flex-col items-center bg-tneutral-800 rounded-2xl p-4 border border-tneutral-600 min-h-[168px]">
          <p class="text-lg">${weekday}</p>
          <img src="${getWeatherIcon(daily.weather_code[i])}" alt="Weather icon" class="daily-icon">
          <div class="flex justify-between items-center text-lg self-stretch mt-3">
            <p class="text-tneutral-200">${Math.round(daily.apparent_temperature_max[i])}°</p>
            <p class="text-tneutral-300">${Math.round(daily.apparent_temperature_min[i])}°</p>
          </div>
        </div>
      `;
    })
    .join("");
};

const buildDaySelector = (times) => {
  const days = [...new Set(times.map((t) => t.split("T")[0]))];

  daySelector.innerHTML = days
    .map((d) => {
      const dayName = new Date(d).toLocaleDateString("en-US", {
        weekday: "long",
      });
      return `<option value="${d}">${dayName}</option>`;
    })
    .join("");

  daySelector.onchange = () => renderHourly(daySelector.value);
};

const renderHourly = (selectedDay) => {
  const { time, apparent_temperature, weather_code } = hourlyData;

  const items = time
    .map((t, i) => ({
      time: t,
      temp: apparent_temperature[i],
      code: weather_code[i],
    }))
    .filter((it) => it.time.startsWith(selectedDay));

  const now = new Date();
  const today = getToday();
  const filtered =
    selectedDay === today
      ? items.filter((it) => new Date(it.time) >= now).slice(0, 8)
      : items.slice(0, 8);

  hourlyForecastContainer.innerHTML = filtered
    .map(
      (item) => `
      <div class="flex items-center justify-between rounded-lg bg-tneutral-700 px-3 py-2 border border-tneutral-600 min-h-[56px]">
        <div class="flex items-center gap-2">
          <img src="${getWeatherIcon(item.code)}" alt="Weather icon" class="w-[13%]">
          <p class="text-lg">${formatHour(item.time)}</p>
        </div>
        <p class="text-tneutral-300 font-medium">${Math.round(item.temp)}°</p>
      </div>
    `
    )
    .join("");
};

// Helpers
const getToday = () => new Date().toISOString().split("T")[0];

retryBtn.addEventListener('click', () => {
  if (lastRequest) {
    fetchData(lastRequest.lat, lastRequest.long, lastRequest.city);
  }
});

window.addEventListener('resize', matchWidth);

window.onload = () => {
  matchWidth();
  fetchData(defLat, defLong, "Berlin, Germany");
};
