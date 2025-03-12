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

