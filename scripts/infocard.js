const infoButton = document.getElementById("info-button");
const infoCard = document.getElementById("info-card");
const closeButton = document.getElementById("close-button");

infoButton.addEventListener("click", function() {
  infoCard.classList.toggle("show");
});

closeButton.addEventListener("click", function() {
  infoCard.classList.remove("show");
});

window.addEventListener("click", function(event) {
  if (event.target === infoCard) {
    infoCard.classList.remove("show");
  }
});