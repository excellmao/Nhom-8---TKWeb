// Handle card clicks to navigate to specific pages
const personalityCards = document.querySelectorAll('.personality-card');

personalityCards.forEach(card => {
  card.addEventListener('click', () => {
    const link = card.getAttribute('data-link');
    if (link) {
      window.location.href = link; // Redirect to the specific page
    }
  });
});

const carousel = document.querySelector('.carousel');
const leftBtn = document.querySelector('.left-btn');
const rightBtn = document.querySelector('.right-btn');

let scrollPosition = 0; // Track the current scroll position
const cardWidth = 240; // Width of each card including margin
const visibleCards = 4; // Number of cards visible at a time
const totalCards = document.querySelectorAll('.personality-card').length;

leftBtn.addEventListener('click', () => {
  if (scrollPosition < 0) {
    scrollPosition += cardWidth * visibleCards; // Scroll left by the width of visible cards
    carousel.style.transform = `translateX(${scrollPosition}px)`;
  }
});

rightBtn.addEventListener('click', () => {
  if (Math.abs(scrollPosition) < (totalCards - visibleCards) * cardWidth) {
    scrollPosition -= cardWidth * visibleCards; // Scroll right by the width of visible cards
    carousel.style.transform = `translateX(${scrollPosition}px)`;
  }
});