// ============================================================
//  H.A. FARMSGH — Homepage Script
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ----------------------------------------------------------
  // 1. STICKY HEADER — add "scrolled" class on scroll
  // ----------------------------------------------------------
  const header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ----------------------------------------------------------
  // 2. MOBILE MENU TOGGLE
  // ----------------------------------------------------------
  document.getElementById('menuToggle')?.addEventListener('click', function () {
    document.getElementById('mainNav').classList.toggle('open');
  });

  // Close nav when a link is clicked (mobile)
  document.querySelectorAll('#mainNav a').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('mainNav')?.classList.remove('open');
    });
  });

  // ----------------------------------------------------------
  // 3. SMOOTH SCROLL for anchor links
  // ----------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ----------------------------------------------------------
  // 4. SCROLL REVEAL (IntersectionObserver)
  // ----------------------------------------------------------
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ----------------------------------------------------------
  // 5. CARD SLIDE-UP (IntersectionObserver)
  // ----------------------------------------------------------
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('slide-up');
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.link-card').forEach(card => cardObserver.observe(card));

  // ----------------------------------------------------------
  // 6. TESTIMONIALS CAROUSEL with dots
  // ----------------------------------------------------------
  const testimonialItems = document.querySelector('.testimonial-items');
  const testimonialItem  = document.querySelector('.testimonial-item');
  const prevButton       = document.querySelector('.carousel-button.prev');
  const nextButton       = document.querySelector('.carousel-button.next');
  const dotsContainer    = document.getElementById('carouselDots');

  if (testimonialItems && testimonialItem) {
    const totalItems = testimonialItems.children.length;
    let currentIndex = 0;
    let autoSlide    = setInterval(nextTestimonial, 5000);
    let isDragging   = false;
    let startX       = 0;

    // Get item width including its margins
    function getItemWidth() {
      const style = window.getComputedStyle(testimonialItem);
      return testimonialItem.offsetWidth
        + parseFloat(style.marginLeft  || 0)
        + parseFloat(style.marginRight || 0);
    }

    let itemWidth = getItemWidth();

    // Build dots
    if (dotsContainer) {
      for (let i = 0; i < totalItems; i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function updateCarousel() {
      testimonialItems.style.transform = `translateX(${-currentIndex * itemWidth}px)`;
      updateDots();
    }

    function goTo(index) {
      currentIndex = (index + totalItems) % totalItems;
      updateCarousel();
    }

    function nextTestimonial() { goTo(currentIndex + 1); }
    function prevTestimonial() { goTo(currentIndex - 1); }

    // Resize handler
    window.addEventListener('resize', () => {
      itemWidth = getItemWidth();
      updateCarousel();
    }, { passive: true });

    // Buttons
    prevButton?.addEventListener('click', () => {
      clearInterval(autoSlide);
      prevTestimonial();
      autoSlide = setInterval(nextTestimonial, 5000);
    });

    nextButton?.addEventListener('click', () => {
      clearInterval(autoSlide);
      nextTestimonial();
      autoSlide = setInterval(nextTestimonial, 5000);
    });

    // Touch support
    testimonialItems.addEventListener('touchstart', (e) => {
      startX     = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    testimonialItems.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const diffX = startX - e.touches[0].clientX;
      testimonialItems.style.transform =
        `translateX(${-currentIndex * itemWidth - diffX}px)`;
    }, { passive: true });

    testimonialItems.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const diffX = startX - e.changedTouches[0].clientX;

      clearInterval(autoSlide);
      if (Math.abs(diffX) > itemWidth / 4) {
        diffX > 0 ? nextTestimonial() : prevTestimonial();
      } else {
        updateCarousel();
      }
      autoSlide = setInterval(nextTestimonial, 5000);
    });

    // Disable when only 1 item
    if (totalItems <= 1) {
      prevButton && (prevButton.style.display = 'none');
      nextButton && (nextButton.style.display = 'none');
      clearInterval(autoSlide);
    }

  } else {
    console.warn('Testimonial carousel elements not found.');
  }

  // ----------------------------------------------------------
  // 7. ROTATING HERO HEADLINE & TAGLINE
  // ----------------------------------------------------------
  const headlines = [
    "Fresh, Healthy & Affordable Poultry",
    "Farm-Raised Chicken You Can Trust",
    "Naturally Nutritious. Deliciously Local.",
    "Your Daily Source of Farm-Fresh Eggs"
  ];
  const taglines = [
    "Premium Eggs and Chicken delivered with care.",
    "Responsibly Raised, Expertly Packed.",
    "Direct from Our Farm to Your Family.",
    "High-Quality Produce. Honest Prices."
  ];

  const headlineEl = document.getElementById('dynamicHeadline');
  const taglineEl  = document.getElementById('dynamicTagline');

  if (headlineEl && taglineEl) {
    let textIndex = 0;

    function updateText() {
      headlineEl.classList.remove('fade-in');
      taglineEl.classList.remove('fade-in');

      setTimeout(() => {
        headlineEl.textContent = headlines[textIndex];
        taglineEl.textContent  = taglines[textIndex];
        headlineEl.classList.add('fade-in');
        taglineEl.classList.add('fade-in');
        textIndex = (textIndex + 1) % headlines.length;
      }, 350);
    }

    setInterval(updateText, 4500);
  }

});
