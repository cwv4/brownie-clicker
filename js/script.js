const OPEN_HAMBURGER_BUTTON = document.querySelector("#hamburger-button");
const CLOSE_HAMBURGER_BUTTON = document.querySelector("#menu-hamburger-button");
const MOBILE_MENU = document.querySelector(".mobile-menu");

OPEN_HAMBURGER_BUTTON.addEventListener("click", function() {
    MOBILE_MENU.classList.add("open");
});


CLOSE_HAMBURGER_BUTTON.addEventListener("click", function() {
    MOBILE_MENU.classList.remove("open");
});
