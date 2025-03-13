 "use strict"
/*
// Hämtar elementen
let openButton = document.getElementById("open-menu");
let closeButton = document.getElementById("close-menu");

//Lägger till eventlyssnare
openButton.addEventListener('click', toggleMenu);
closeButton.addEventListener('click', toggleMenu);

// Skapar funktionen som fungerar på båda knapparna
function toggleMenu() {
    let navMenuEl = document.getElementById("nav-menu");
    navMenuEl.classList.toggle("open")

    let style = window.getComputedStyle(navMenuEl);
    if (style.display === "none") {
        navMenuEl.style.display = "block";
    } else {
        navMenuEl.style.display = "none";
    }
} */

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

    // Kontrollerar att elementen finns och om de inte finns så avbryts koden med return
    if (!searchButton || !locationInput || !mapContainer || !weatherInfo) {
        return;
    }

    // Funktionen tar in parametrarna longitud och latitud
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
        // Hämtar väderdata från OpenWeather API med angivna latitud och longitud
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=sv`)
            .then(response => response.json()) // Konverterar svaret till JSON-format
            .then(weatherData => {
                // Kontrollerar om API-anropet lyckades (kod 200 betyder att data hämtades korrekt)
                if (weatherData.cod === 200) {
                    // Uppdaterar väderinformationen i HTML med data från API
                    weatherInfo.innerHTML = `
                        <div class="weather-card">
                            <h3 class="city-name">${weatherData.name}, ${weatherData.sys.country}</h3>
                            <p class="weather-description">${weatherData.weather[0].description}</p>
                            <p class="temperature">🌡️ <span>${weatherData.main.temp}°C</span></p>
                            <p class="wind-speed">💨 <span>${weatherData.wind.speed} m/s</span></p>
                        </div>
                    `;
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

    function searchLocation() {
        // Hämtar platsen som användaren har skrivit in i inputfältet och tar bort eventuella mellanslag i början/slutet
        let location = locationInput.value.trim();
    
        // Kontrollerar om inputfältet är tomt, om ja - visa en varning och avsluta funktionen
        if (!location) {
            alert("Ange en plats!"); // Meddelar användaren att de måste ange en plats
            return;
        }
    
        // Skickar en förfrågan till Nominatim API (OpenStreetMap) för att hämta latitud och longitud för platsen
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`)
            .then(response => response.json()) // Konverterar svaret till JSON-format
            .then(data => {
                // Om inga resultat hittades, visa en varning och avsluta funktionen
                if (data.length === 0) {
                    alert("Platsen hittades inte!"); // Meddelar användaren att platsen inte kunde hittas
                    return;
                }
    
                // Konverterar latitud och longitud från sträng till flyttal (decimaltal)
                let lat = parseFloat(data[0].lat);
                let lon = parseFloat(data[0].lon);
    
                // Uppdaterar kartan med de nya koordinaterna
                updateMap(lat, lon);
                // Hämtar och uppdaterar väderinformationen för platsen
                updateWeather(lat, lon);
            })
            .catch(error => {
                // Om något går fel vid API-anropet, loggas felet i konsolen
                console.error("Fel vid API-anrop:", error);
            });
    }

    searchButton.addEventListener("click", searchLocation);
});