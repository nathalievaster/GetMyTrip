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

// Samlar alla element samt API-nyckeln från OpenWeather i variabler

    const searchButton = document.getElementById("search-btn");
    const locationInput = document.getElementById("city-input");
    const mapContainer = document.getElementById("map-container");
    const weatherInfo = document.getElementById("weather-info");
    const API_KEY = "0cef79cf6ad06decc7cf8cf1842e442d";
