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

