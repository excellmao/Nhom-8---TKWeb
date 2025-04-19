document.addEventListener('DOMContentLoaded',  function() {
  // Table of contents functionality
  const sections = document.querySelectorAll('.section');
  const tocLinks = document.querySelectorAll('#table-of-contents a');
  const header = document.querySelector('.header');
const headerHeight = header ? header.offsetHeight : 0;
const targetPosition = targetElement.offsetTop - headerHeight;
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      window.scrollTo({
        top: targetElement.offsetTop - 20,
        behavior: 'smooth'
      });
    });
  });
  
  // Highlight active section in table of contents
  window.addEventListener('scroll', function() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (pageYOffset >= sectionTop - 100) {
        current = '#' + section.getAttribute('id');
      }
    });
    
    tocLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === current) {
        link.classList.add('active');
      }
    });
  });
  
  // Subtle animation for letter blocks
  const letterBlocks = document.querySelectorAll('.letter-block');
  
  letterBlocks.forEach((block, index) => {
    setTimeout(() => {
      block.style.opacity = '1';
      block.style.transform = 'translateY(0)';
    }, 200 * index);
  });
});
 