document.addEventListener('DOMContentLoaded', function () {

  // 1. STICKY HEADER — add "scrolled" class on scroll
  const header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // 2. MOBILE MENU TOGGLE
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });
  }

  // Close nav when a link is clicked (mobile)
  document.querySelectorAll('#mainNav a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav?.classList.remove('open');
    });
  });

  // 3. SMOOTH SCROLL for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // 4. GALLERY LIGHTBOX functionality placeholder
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      // In a real implementation, this would open a lightbox/modal
      alert('Image clicked! This would open a larger view in a real implementation.');
    });
  });

});
