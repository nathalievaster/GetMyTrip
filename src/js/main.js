"use strict"

import Chart from 'chart.js/auto';

/**
 * Vänta på att hela dokumentet har laddats innan teman och event listeners aktiveras
 */
document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme");

    // Kontrollera om användaren har ett sparat tema i localStorage
    if (currentTheme) {
        document.documentElement.setAttribute("data-theme", currentTheme);
        if (currentTheme === "dark") {
            themeToggle.checked = true; // Om mörkt tema är valt, sätt på switchen
        }
    }

    // Lägg till en eventlistener på toggle-knappen
    themeToggle.addEventListener("change", () => {
        let theme = document.documentElement.getAttribute("data-theme");

        if (theme === "dark") {
            // Sätt tillbaka ljust tema
            document.documentElement.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
        } else {
            // Sätt mörkt tema
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        }
    });
});

/**
 * Uppdaterar kartan med en markör på angivna lat och lon
 * @param {number} lat - Latitud för platsen
 * @param {number} lon - Longitud för platsen
 */
function updateMap(lat, lon) {
    const mapContainer = document.getElementById("map-container");
    mapContainer.innerHTML = ` 
        <iframe 
            width="100%" 
            height="400" 
            style="border-radius: 10px; border: none;"
            src="https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.05},${lat - 0.05},${lon + 0.05},${lat + 0.05}&layer=mapnik&marker=${lat},${lon}">
        </iframe>
    `;
}

let weatherChart; // Håller referens till diagrammet

/**
 * Hämtar väderdata och uppdaterar väderinfo och diagram
 * @param {number} lat - Latitud för platsen
 * @param {number} lon - Longitud för platsen
 */
function updateWeather(lat, lon) {
    const weatherInfo = document.getElementById("weather-info");
    const API_KEY = "0cef79cf6ad06decc7cf8cf1842e442d";

    document.getElementById("loading-spinner").classList.remove("hidden"); // Visar spinnern när det laddar

    // Hämtar 5-dagarsprognosen från OpenWeather API
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=sv`)
        .then(response => response.json())
        .then(weatherData => {
            document.getElementById("loading-spinner").classList.add("hidden"); // Gömmer när det laddat klart
            if (weatherData.cod === "200") {
                const cityName = weatherData.city.name;
                const country = weatherData.city.country;

                // Filtrera fram EN temperatur per dag (kl 12:00 varje dag)
                let dailyTemps = {};
                weatherData.list.forEach(entry => {
                    const date = entry.dt_txt.split(" ")[0];
                    if (!dailyTemps[date] && entry.dt_txt.includes("12:00:00")) {
                        dailyTemps[date] = entry.main.temp;
                    }
                });

                const labels = Object.keys(dailyTemps).map(date => new Date(date).toLocaleDateString("sv-SE", { weekday: "short" }));
                const temps = Object.values(dailyTemps);

                // Uppdatera väderinformationen i HTML
                weatherInfo.innerHTML = `
                    <div class="weather-card">
                        <h3 class="city-name">${cityName}, ${country}</h3>
                        <p class="weather-description">${weatherData.list[0].weather[0].description}</p>
                        <p class="temperature">🌡️ <span>${weatherData.list[0].main.temp}°C</span></p>
                        <p class="wind-speed">💨 <span>${weatherData.list[0].wind.speed} m/s</span></p>
                    </div>
                `;

                // Uppdatera diagrammet
                updateWeatherChart(temps, labels);
            } else {
                weatherInfo.textContent = "Väderinformation kunde inte hämtas.";
            }
        })
        .catch(error => {
            console.error("Fel vid hämtning av väderdata:", error);
            weatherInfo.textContent = "Något gick fel vid hämtning av väder!";
        });
}

/**
 * Uppdaterar eller skapar ett linjediagram med temperaturdata
 * @param {number[]} temps - Array med temperaturvärden
 * @param {string[]} labels - Array med etiketter (dagar)
 */
function updateWeatherChart(temps, labels) {
    const ctx = document.getElementById('weatherChart').getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(0, 123, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(0, 123, 255, 0)');

    if (weatherChart) {
        weatherChart.data.labels = labels;
        weatherChart.data.datasets[0].data = temps;
        weatherChart.update();
    } else {
        weatherChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Temperatur (°C)',
                    data: temps,
                    borderColor: '#007bff',
                    backgroundColor: gradient, 
                    borderWidth: 2,
                    pointBackgroundColor: '#fff', 
                    pointRadius: 5, 
                    fill: true, 
                    tension: 0.4 
                }]
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                            color: '#fff'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#fff'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#fff'
                        }
                    }
                }
            }
        });
    }
}

/**
 * Söker efter en plats, hämtar dess koordinater och uppdaterar karta och väder
 */
function searchLocation() {
    const locationInput = document.getElementById("city-input");
    const location = locationInput.value.trim();

    if (!location) {
        alert("Ange en plats!");
        return;
    }

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                alert("Platsen hittades inte!");
                return;
            }

            let lat = parseFloat(data[0].lat);
            let lon = parseFloat(data[0].lon);

            updateMap(lat, lon);
            updateWeather(lat, lon);
        })
        .catch(error => {
            console.error("Fel vid API-anrop:", error);
        });
}

// Initiera kartan och vädret med Göteborg vid sidladdning
updateMap(57.7089, 11.9746);
updateWeather(57.7089, 11.9746);

// KARTAN - DOMContentLoaded för knapp
const searchButton = document.getElementById("search-btn");
searchButton.addEventListener("click", searchLocation);

// Funktion för att main flyttas vid skroll
window.addEventListener('scroll', () => {
    const main = document.querySelector('main');
    const scrollY = window.scrollY;

    // Ju mer man skrollar, desto mer rör sig main uppåt lite grann
    if(scrollY < 200) {
        main.style.transform = `translateY(${scrollY * 0.4}px)`;
    }
});

// LIGHTBOX
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const closeBtn = document.getElementById('lightbox-close');

document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = img.dataset.caption;
        lightbox.style.display = 'flex';
    });
});

closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
});