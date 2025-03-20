 "use strict"

 import Chart from 'chart.js/auto';

// Knapp för ljust och mörkt tema

// Vänta på att hela dokumentet har laddats
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

  // KARTAN
// Lyssnar efter när DOMen laddats klart innan funktionen körs

document.addEventListener("DOMContentLoaded", () => {
    // Samlar alla element samt API-nyckeln från OpenWeather i variabler
    const searchButton = document.getElementById("search-btn");
    const locationInput = document.getElementById("city-input");
    const mapContainer = document.getElementById("map-container");
    const weatherInfo = document.getElementById("weather-info");
    const API_KEY = "0cef79cf6ad06decc7cf8cf1842e442d";

    if (!searchButton || !locationInput || !mapContainer || !weatherInfo) return;

    let weatherChart; // Håller referens till diagrammet

    function updateMap(lat, lon) {
        // Lägger kartan i en iframe med style
        mapContainer.innerHTML = ` 
            <iframe 
                width="100%" 
                height="400" 
                style="border-radius: 10px; border: none;"
                src="https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.05},${lat-0.05},${lon+0.05},${lat+0.05}&layer=mapnik&marker=${lat},${lon}">
            </iframe>
        `;
        // Skapar ett litet område kring punkten med bounding box och sätter en markör på punkten
    }

    function updateWeather(lat, lon) {

        document.getElementById("loading-spinner").classList.remove("hidden"); // Visar spinnern när det laddar
        // Hämtar 5-dagarsprognosen från OpenWeather API
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=sv`)
            .then(response => response.json()) // Konverterar svaret till JSON-format
            .then(weatherData => {
                document.getElementById("loading-spinner").classList.add("hidden"); // Gömmer när det laddat klart
                // Kontrollerar om API-anropet lyckades (kod 200 betyder att data hämtades korrekt)
                if (weatherData.cod === "200") {
                    // Hämta stadens namn och landets kod
                    const cityName = weatherData.city.name;
                    const country = weatherData.city.country;

                    // Filtrera fram EN temperatur per dag (kl 12:00 varje dag)
                    let dailyTemps = {};
                    weatherData.list.forEach(entry => {
                        const date = entry.dt_txt.split(" ")[0]; // Hämta bara datumet (YYYY-MM-DD)
                        if (!dailyTemps[date] && entry.dt_txt.includes("12:00:00")) {
                            dailyTemps[date] = entry.main.temp;
                        }
                    });

                    // Konvertera till arrays för diagrammet
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
                    // Om API-svaret innehåller ett felmeddelande, visas detta istället
                    weatherInfo.textContent = "Väderinformation kunde inte hämtas.";
                }
            })
            .catch(error => {
                // Om något går fel vid API-anropet, loggas felet i konsolen och ett felmeddelande visas
                console.error("Fel vid hämtning av väderdata:", error);
                weatherInfo.textContent = "Något gick fel vid hämtning av väder!";
            });
    }

    function updateWeatherChart(temps, labels) {
        const ctx = document.getElementById('weatherChart').getContext('2d');

        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(0, 123, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 123, 255, 0)');

        if (weatherChart) {
            // Om diagrammet redan finns, uppdatera det
            weatherChart.data.labels = labels;
            weatherChart.data.datasets[0].data = temps;
            weatherChart.update();
        } else {
            // Om inget diagram finns, skapa ett nytt
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
                                color: '#fff' // <-- färg på "Temperatur (°C)"
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: '#fff' // <-- färg på X-axelns labels
                            }
                        },
                        y: {
                            ticks: {
                                color: '#fff' // <-- färg på Y-axelns labels
                            }
                        }
                    }
                }
            });
        }
    }

    function searchLocation() {
        // Hämtar platsen som användaren har skrivit in i inputfältet och tar bort eventuella mellanslag i början/slutet
        let location = locationInput.value.trim();
    
        // Kontrollerar om inputfältet är tomt, om ja - visa en varning och avsluta funktionen
        if (!location) {
            alert("Ange en plats!");
            return;
        }
    
        // Skickar en förfrågan till Nominatim API (OpenStreetMap) för att hämta latitud och longitud för platsen
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`)
            .then(response => response.json()) // Konverterar svaret till JSON-format
            .then(data => {
                // Om inga resultat hittades, visa en varning och avsluta funktionen
                if (data.length === 0) {
                    alert("Platsen hittades inte!");
                    return;
                }

                let lat = parseFloat(data[0].lat);
                let lon = parseFloat(data[0].lon);

                updateMap(lat, lon);
                // Hämtar och uppdaterar väderinformationen för platsen
                updateWeather(lat, lon);
            })
            .catch(error => {
                // Om något går fel vid API-anropet, loggas felet i konsolen
                console.error("Fel vid API-anrop:", error);
            });
    }

    // Initiera kartan och vädret med Göteborg vid sidladdning
    updateMap(57.7089, 11.9746);
    updateWeather(57.7089, 11.9746);

    searchButton.addEventListener("click", searchLocation);
});

window.addEventListener('scroll', () => {
    const main = document.querySelector('main');
    const scrollY = window.scrollY;

    // Ju mer man skrollar, desto mer rör sig main uppåt lite grann
    if(scrollY < 200) {
        main.style.transform = `translateY(${scrollY * 0.4}px)`;
    }
});
