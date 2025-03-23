 "use strict"
 import Chart from 'chart.js/auto';

 /**
  * Väntar på att DOM:en har laddats och hanterar tema-toggle.
  */
 document.addEventListener("DOMContentLoaded", () => {
     const themeToggle = document.getElementById("theme-toggle");
     const currentTheme = localStorage.getItem("theme");
 
     if (currentTheme) {
         document.documentElement.setAttribute("data-theme", currentTheme);
         if (currentTheme === "dark") {
             themeToggle.checked = true;
         }
     }
 
     /**
      * Växlar mellan ljust och mörkt tema och sparar valet i localStorage.
      */
     themeToggle.addEventListener("change", () => {
         let theme = document.documentElement.getAttribute("data-theme");
         if (theme === "dark") {
             document.documentElement.setAttribute("data-theme", "light");
             localStorage.setItem("theme", "light");
         } else {
             document.documentElement.setAttribute("data-theme", "dark");
             localStorage.setItem("theme", "dark");
         }
     });
 });
 
 /**
  * Väntar på att DOM:en har laddats och hanterar kartan och vädret.
  */
 document.addEventListener("DOMContentLoaded", () => {
     const searchButton = document.getElementById("search-btn");
     const locationInput = document.getElementById("city-input");
     const mapContainer = document.getElementById("map-container");
     const weatherInfo = document.getElementById("weather-info");
     const API_KEY = "0cef79cf6ad06decc7cf8cf1842e442d";
 
     if (!searchButton || !locationInput || !mapContainer || !weatherInfo) return;
 
     let weatherChart;
 
     /**
      * Uppdaterar kartan med en markerad punkt baserat på latitud och longitud.
      * @param {number} lat - Latitud.
      * @param {number} lon - Longitud.
      */
     function updateMap(lat, lon) {
         mapContainer.innerHTML = ` 
             <iframe 
                 width="100%" 
                 height="400" 
                 style="border-radius: 10px; border: none;"
                 src="https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.05},${lat-0.05},${lon+0.05},${lat+0.05}&layer=mapnik&marker=${lat},${lon}">
             </iframe>
         `;
     }
 
     /**
      * Hämtar och uppdaterar väderdata från OpenWeather API.
      * @param {number} lat - Latitud.
      * @param {number} lon - Longitud.
      */
     function updateWeather(lat, lon) {
         document.getElementById("loading-spinner").classList.remove("hidden");
 
         fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=sv`)
             .then(response => response.json())
             .then(weatherData => {
                 document.getElementById("loading-spinner").classList.add("hidden");
 
                 if (weatherData.cod === "200") {
                     const cityName = weatherData.city.name;
                     const country = weatherData.city.country;
 
                     let dailyTemps = {};
                     weatherData.list.forEach(entry => {
                         const date = entry.dt_txt.split(" ")[0];
                         if (!dailyTemps[date] && entry.dt_txt.includes("12:00:00")) {
                             dailyTemps[date] = entry.main.temp;
                         }
                     });
 
                     const labels = Object.keys(dailyTemps).map(date => new Date(date).toLocaleDateString("sv-SE", { weekday: "short" }));
                     const temps = Object.values(dailyTemps);
 
                     weatherInfo.innerHTML = `
                         <div class="weather-card">
                             <h3 class="city-name">${cityName}, ${country}</h3>
                             <p class="weather-description">${weatherData.list[0].weather[0].description}</p>
                             <p class="temperature">🌡️ <span>${weatherData.list[0].main.temp}°C</span></p>
                             <p class="wind-speed">💨 <span>${weatherData.list[0].wind.speed} m/s</span></p>
                         </div>
                     `;
 
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
      * Skapar eller uppdaterar ett linjediagram med temperaturdata.
      * @param {number[]} temps - Array med temperaturer.
      * @param {string[]} labels - Array med veckodagar.
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
      * Hämtar latitud och longitud från användarens input och anropar kart- och väderuppdatering.
      */
     function searchLocation() {
         let location = locationInput.value.trim();
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
 
     updateMap(57.7089, 11.9746);
     updateWeather(57.7089, 11.9746);
 
     searchButton.addEventListener("click", searchLocation);
 });
 
 /**
  * Flyttar main-sektionen beroende på skrollhöjd för att skapa en rörelseeffekt.
  */
 window.addEventListener('scroll', () => {
     const main = document.querySelector('main');
     const scrollY = window.scrollY;
 
     if (scrollY < 200) {
         main.style.transform = `translateY(${scrollY * 0.4}px)`;
     }
 });
 
 // LIGHTBOX
 
 /**
  * Öppnar lightbox med bild och beskrivning när en bild i galleriet klickas.
  */
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
 
 /**
  * Stänger lightbox när användaren klickar på stäng-knappen.
  */
 closeBtn.addEventListener('click', () => {
     lightbox.style.display = 'none';
 });
 