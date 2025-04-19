// Handle card clicks to navigate to specific pages
const personalityCards = document.querySelectorAll('.personality-card');

document.addEventListener("DOMContentLoaded", () => {
  const personalityCards = document.querySelectorAll("[data-link]");

  personalityCards.forEach(card => {
    card.addEventListener("click", () => {
      const link = card.getAttribute("data-link");
      if (link) {
        window.location.href = link;
      }
    });
  });
});

const carousel = document.querySelector('.carousel');
const leftBtn = document.querySelector('.left-btn');
const rightBtn = document.querySelector('.right-btn');

let scrollPosition = 0; // Track the current scroll position
const cardWidth = 240; // Width of each card including margin
const visibleCards = 4; // Number of cards visible at a time
const totalCards = document.querySelectorAll('.personality-card').length;