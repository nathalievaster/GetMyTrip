 "use strict"

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
}

// Knapp för ljust och mörkt tema

document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme");

    // Sätt temat vid sidladdning
    if (currentTheme) {
        document.documentElement.setAttribute("data-theme", currentTheme);
        document.body.classList.toggle("dark-mode", currentTheme === "dark");

        // Uppdatera knappens text vid sidladdning
        themeToggle.textContent = currentTheme === "dark" ? "Byt till ljust läge" : "Byt till mörkt läge";
    }

    themeToggle.addEventListener("click", () => {
        let theme = document.documentElement.getAttribute("data-theme");

        if (theme === "dark") {
            document.documentElement.setAttribute("data-theme", "light");
            document.body.classList.remove("dark-mode");
            localStorage.setItem("theme", "light");
            themeToggle.textContent = "Byt till mörkt läge";
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            document.body.classList.add("dark-mode");
            localStorage.setItem("theme", "dark");
            themeToggle.textContent = "Byt till ljust läge";
        }
    });
});