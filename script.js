// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme') || 'light-mode';
document.documentElement.setAttribute('data-theme', currentTheme);
if (currentTheme === 'dark-mode') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    let theme = 'light-mode';
    if (document.body.classList.contains('dark-mode')) {
        theme = 'dark-mode';
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    localStorage.setItem('theme', theme);
});

// ===== UNIT TOGGLE =====
const unitToggle = document.getElementById('unitToggle');
let isCelsius = localStorage.getItem('unit') !== 'F';
let currentTemp = 0;
let currentFeelsLike = 0;

unitToggle.addEventListener('click', function() {
    isCelsius = !isCelsius;
    localStorage.setItem('unit', isCelsius ? 'C' : 'F');
    unitToggle.innerText = isCelsius ? '°C' : '°F';
    
    // Update displayed temperatures
    updateTemperatureDisplay();
});

function convertTemp(temp) {
    if (isCelsius) return Math.round(temp);
    return Math.round((temp * 9/5) + 32);
}

function updateTemperatureDisplay() {
    document.getElementById('temp').innerText = convertTemp(currentTemp) + (isCelsius ? '°C' : '°F');
    document.getElementById('feelsLike').innerText = `Terasa seperti ${convertTemp(currentFeelsLike)}${isCelsius ? '°C' : '°F'}`;
}

// ===== USER PROFILE =====
const userNames = ['Weather Enthusiast', 'Sky Watcher', 'Climate Observer', 'Weather Tracker'];
const randomUser = userNames[Math.floor(Math.random() * userNames.length)];
document.getElementById('userName').innerText = randomUser;

// ===== WEATHER ICONS =====
function getWeatherIcon(code) {
    // WMO Weather interpretation codes
    if (code === 0) return "☀️"; // Clear
    if (code === 1 || code === 2) return "🌤️"; // Mostly clear
    if (code === 3) return "☁️"; // Overcast
    if (code === 45 || code === 48) return "🌫️"; // Foggy
    if (code >= 51 && code <= 67) return "🌧️"; // Drizzle
    if (code >= 71 && code <= 77) return "❄️"; // Snow
    if (code >= 80 && code <= 82) return "🌧️"; // Rain showers
    if (code >= 85 && code <= 86) return "🌨️"; // Snow showers
    if (code >= 80 && code <= 82) return "⛈️"; // Thunderstorm
    return "🌤️";
}

function getWeatherDesc(code) {
    if (code === 0) return "Cerah";
    if (code === 1 || code === 2) return "Sebagian Berawan";
    if (code === 3) return "Mendung";
    if (code === 45 || code === 48) return "Berkabut";
    if (code >= 51 && code <= 67) return "Gerimis";
    if (code >= 71 && code <= 77) return "Bersalju";
    if (code >= 80 && code <= 82) return "Hujan";
    if (code >= 85 && code <= 86) return "Hujan Salju";
    if (code >= 80 && code <= 82) return "Badai";
    return "Tidak diketahui";
}

function getWindDirection(degree) {
    const directions = ['Utara', 'Timur Laut', 'Timur', 'Tenggara', 'Selatan', 'Barat Daya', 'Barat', 'Barat Laut'];
    const index = Math.round(degree / 45) % 8;
    return directions[index];
}

// ===== FAVORITES MANAGEMENT =====
function loadFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
}

function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function isCityFavorited(lat, lon) {
    const favorites = loadFavorites();
    return favorites.some(fav => fav.lat == lat && fav.lon == lon);
}

function toggleFavorite(lat, lon, city) {
    const favorites = loadFavorites();
    const index = favorites.findIndex(fav => fav.lat == lat && fav.lon == lon);
    
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push({ lat, lon, city });
    }
    
    saveFavorites(favorites);
    updateFavoriteButton(lat, lon);
    renderFavorites();
}

function updateFavoriteButton(lat, lon) {
    const btn = document.getElementById('favoriteBtn');
    if (isCityFavorited(lat, lon)) {
        btn.classList.add('active');
        btn.innerHTML = '<i class="fas fa-heart"></i>';
    } else {
        btn.classList.remove('active');
        btn.innerHTML = '<i class="far fa-heart"></i>';
    }
}

function renderFavorites() {
    const favorites = loadFavorites();
    const container = document.getElementById('favoritesList');
    const section = document.getElementById('favoritesSection');
    
    if (favorites.length === 0) {
        section.classList.remove('active');
        return;
    }
    
    section.classList.add('active');
    container.innerHTML = favorites.map(fav => `
        <div class="favorite-chip" onclick="getWeather(${fav.lat}, ${fav.lon}, '${fav.city}')">
            <span>${fav.city}</span>
            <span class="remove-fav" onclick="event.stopPropagation(); toggleFavorite(${fav.lat}, ${fav.lon}, '${fav.city}');">×</span>
        </div>
    `).join('');
}

// ===== RECENT CITIES =====
function loadRecentCities() {
    return JSON.parse(localStorage.getItem('recentCities')) || [];
}

function saveRecentCities(cities) {
    localStorage.setItem('recentCities', JSON.stringify(cities));
}

function addRecentCity(lat, lon, city) {
    let recent = loadRecentCities();
    recent = recent.filter(r => !(r.lat == lat && r.lon == lon));
    recent.unshift({ lat, lon, city });
    recent = recent.slice(0, 5); // Keep only 5 recent
    saveRecentCities(recent);
    renderRecentCities();
}

function renderRecentCities() {
    const recent = loadRecentCities();
    const container = document.getElementById('recentList');
    const section = document.getElementById('recentSection');
    
    if (recent.length === 0) {
        section.classList.remove('active');
        return;
    }
    
    section.classList.add('active');
    container.innerHTML = recent.map(r => `
        <div class="recent-item" onclick="getWeather(${r.lat}, ${r.lon}, '${r.city}')">
            ${r.city}
        </div>
    `).join('');
}

// ===== SEARCH FUNCTIONALITY =====
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// Popular cities for search
const popularCities = [
    { name: 'Jakarta', lat: -6.2, lon: 106.8 },
    { name: 'Bandung', lat: -6.9, lon: 107.6 },
    { name: 'Surabaya', lat: -7.25, lon: 112.75 },
    { name: 'Medan', lat: 3.6, lon: 98.7 },
    { name: 'Semarang', lat: -6.97, lon: 110.42 },
    { name: 'Makassar', lat: -5.35, lon: 119.43 },
    { name: 'Palembang', lat: -2.92, lon: 104.75 },
    { name: 'Yogyakarta', lat: -7.8, lon: 110.36 },
    { name: 'Pekanbaru', lat: 0.53, lon: 101.45 },
    { name: 'Tokyo', lat: 35.6, lon: 139.6 },
    { name: 'Bangkok', lat: 13.73, lon: 100.49 },
    { name: 'Singapore', lat: 1.35, lon: 103.82 },
    { name: 'Sydney', lat: -33.87, lon: 151.21 },
    { name: 'Paris', lat: 48.86, lon: 2.35 },
    { name: 'London', lat: 51.51, lon: -0.13 },
    { name: 'New York', lat: 40.71, lon: -74.01 },
    { name: 'Los Angeles', lat: 34.05, lon: -118.24 },
    { name: 'Dubai', lat: 25.2, lon: 55.27 }
];

searchInput.addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (!query) {
        searchResults.classList.remove('active');
        return;
    }
    
    const results = popularCities.filter(city => 
        city.name.toLowerCase().includes(query)
    );
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item">Kota tidak ditemukan</div>';
    } else {
        searchResults.innerHTML = results.map(r => `
            <div class="search-result-item" onclick="selectSearchResult(${r.lat}, ${r.lon}, '${r.name}')">
                <strong>${r.name}</strong>
            </div>
        `).join('');
    }
    
    searchResults.classList.add('active');
});

function selectSearchResult(lat, lon, city) {
    getWeather(lat, lon, city);
    searchInput.value = '';
    searchResults.classList.remove('active');
}

// Close search results when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-container')) {
        searchResults.classList.remove('active');
    }
});

// ===== GEOLOCATION =====
document.getElementById('geolocateBtn').addEventListener('click', function() {
    if (navigator.geolocation) {
        showLoading();
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                // Reverse geocoding would be ideal, but we'll use approximate city name
                getWeather(latitude, longitude, `Lokasi (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`);
            },
            error => {
                hideLoading();
                alert('Tidak bisa mengakses lokasi Anda');
            }
        );
    } else {
        alert('Geolocation tidak didukung browser Anda');
    }
});

// ===== LOADING STATE =====
function showLoading() {
    document.getElementById('loading').classList.add('active');
}

function hideLoading() {
    document.getElementById('loading').classList.remove('active');
}

// ===== MAIN WEATHER FUNCTION =====
let currentLat = -6.2;
let currentLon = 106.8;

async function getWeather(lat, lon, city="Lokasi") {
    showLoading();
    currentLat = lat;
    currentLon = lon;
    
    try {
        // Fetch current weather and daily forecast
        const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,wind_direction_10m,weather_code,visibility,pressure_msl,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset&timezone=auto`
        );

        const data = await res.json();
        const current = data.current_weather;
        const hourly = data.hourly;
        const daily = data.daily;
        
        currentTemp = current.temperature;
        currentFeelsLike = hourly.apparent_temperature[0];

        // Update main display
        document.getElementById("cityName").innerText = city;
        document.getElementById("weatherIconLarge").innerText = getWeatherIcon(current.weather_code);
        document.getElementById("temp").innerText = convertTemp(currentTemp) + (isCelsius ? '°C' : '°F');
        document.getElementById("desc").innerText = getWeatherDesc(current.weather_code);
        document.getElementById("feelsLike").innerText = `Terasa seperti ${convertTemp(currentFeelsLike)}${isCelsius ? '°C' : '°F'}`;

        // Details
        document.getElementById("wind").innerText = Math.round(current.windspeed) + " km/h";
        document.getElementById("windDir").innerText = getWindDirection(current.wind_direction);
        document.getElementById("humidity").innerText = hourly.relative_humidity_2m[0] + "%";
        document.getElementById("status").innerText = getWeatherDesc(current.weather_code);
        document.getElementById("visibility").innerText = (hourly.visibility[0] / 1000).toFixed(1) + " km";
        document.getElementById("pressure").innerText = (hourly.pressure_msl[0] / 10).toFixed(0) + " hPa";
        
        const uvIndex = hourly.uv_index[0];
        document.getElementById("uvIndex").innerText = Math.round(uvIndex);
        
        // Sunrise & Sunset
        const sunrise = new Date(daily.sunrise[0]).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const sunset = new Date(daily.sunset[0]).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        document.getElementById("sunrise").innerText = sunrise;
        document.getElementById("sunset").innerText = sunset;

        // Hourly Forecast (24 hours)
        let forecastHTML = "";
        for (let i = 0; i < 24; i++) {
            const temp = convertTemp(hourly.temperature_2m[i]);
            const hour = String(i).padStart(2, '0');
            const icon = getWeatherIcon(hourly.weather_code[i]);
            forecastHTML += `
                <div>
                    <div style="font-size: 24px;">${icon}</div>
                    <h4>${temp}${isCelsius ? '°C' : '°F'}</h4>
                    <p>${hour}:00</p>
                </div>
            `;
        }
        document.getElementById("forecast").innerHTML = forecastHTML;

        // Weekly Forecast (7 days)
        let weeklyHTML = "";
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        for (let i = 0; i < 7; i++) {
            const date = new Date(daily.time[i]);
            const dayName = days[date.getDay()];
            const maxTemp = convertTemp(daily.temperature_2m_max[i]);
            const minTemp = convertTemp(daily.temperature_2m_min[i]);
            const icon = getWeatherIcon(daily.weather_code[i]);
            
            weeklyHTML += `
                <div class="weekly-day">
                    <h4>${dayName}</h4>
                    <div class="day-icon">${icon}</div>
                    <p class="temp">${maxTemp}°</p>
                    <p style="opacity: 0.6; margin: 0;">${minTemp}°</p>
                    <p style="font-size: 12px; margin-top: 5px;">${getWeatherDesc(daily.weather_code[i])}</p>
                </div>
            `;
        }
        document.getElementById("weeklyForecast").innerHTML = weeklyHTML;

        // Update favorite button
        updateFavoriteButton(lat, lon);
        
        // Add to recent cities
        addRecentCity(lat, lon, city);
        
        hideLoading();
    } catch (error) {
        console.error('Error fetching weather:', error);
        hideLoading();
        alert('Gagal mengambil data cuaca. Silakan coba lagi.');
    }
}

function getWeatherFromSelect() {
    const value = document.getElementById("city").value;
    const [lat, lonCity] = value.split(",");
    const [lon, city] = lonCity.split("|");
    getWeather(parseFloat(lat), parseFloat(lon), city);
}

// Add favorite button click handler
document.getElementById('favoriteBtn').addEventListener('click', function() {
    toggleFavorite(currentLat, currentLon, document.getElementById('cityName').innerText);
});

// Initialize
window.onload = () => {
    renderFavorites();
    renderRecentCities();
    getWeather(-6.2, 106.8, "Jakarta");
};