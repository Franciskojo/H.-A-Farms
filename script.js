// JavaScript for interactive elements
document.addEventListener('DOMContentLoaded', function () {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Slide-up animation for cards
  const observerOptions = { threshold: 0.1 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('slide-up');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.highlight-card, .link-card').forEach(card => {
    observer.observe(card);
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    });
  });

  document.getElementById("menuToggle").addEventListener("click", function () {
    document.getElementById("mainNav").classList.toggle("open");
  });



  // Testimonials carousel
  const testimonialItems = document.querySelector('.testimonial-items');
  const testimonialItem = document.querySelector('.testimonial-item');
  const prevButton = document.querySelector('.carousel-button.prev');
  const nextButton = document.querySelector('.carousel-button.next');

  if (testimonialItems && testimonialItem) {
    let testimonialItemWidth = testimonialItem.clientWidth;
    let currentIndex = 0;
    let autoSlide = setInterval(nextTestimonial, 5000);

    function updateCarousel() {
      const offset = -currentIndex * testimonialItemWidth;
      testimonialItems.style.transform = `translateX(${offset}px)`;
    }

    function nextTestimonial() {
      currentIndex = (currentIndex + 1) % testimonialItems.children.length;
      updateCarousel();
    }

    function prevTestimonial() {
      currentIndex = (currentIndex - 1 + testimonialItems.children.length) % testimonialItems.children.length;
      updateCarousel();
    }

    // Resize handler
    window.addEventListener('resize', () => {
      testimonialItemWidth = testimonialItem.clientWidth;
      updateCarousel();
    });

    // Navigation buttons
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
    let startX = 0;
    let isDragging = false;

    testimonialItems.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    testimonialItems.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const currentX = e.touches[0].clientX;
      const diffX = startX - currentX;
      testimonialItems.style.transform = `translateX(${-currentIndex * testimonialItemWidth - diffX}px)`;
    }, { passive: true });

    testimonialItems.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;

      if (Math.abs(diffX) > testimonialItemWidth / 4) {
        if (diffX > 0) {
          nextTestimonial();
        } else {
          prevTestimonial();
        }
      } else {
        updateCarousel();
      }
    });

    // Disable carousel if only 1 item
    if (testimonialItems.children.length <= 1) {
      prevButton.style.display = 'none';
      nextButton.style.display = 'none';
      clearInterval(autoSlide);
    }
  } else {
    console.error('Testimonial carousel elements not found!');
  }

  // Placeholder form handler (if needed)
  function handleContactSubmit(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
  }
});


  document.addEventListener("DOMContentLoaded", () => {
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

    let index = 0;
    const headlineEl = document.getElementById("dynamicHeadline");
    const taglineEl = document.getElementById("dynamicTagline");

    function updateText() {
      headlineEl.classList.remove("fade-in");
      taglineEl.classList.remove("fade-in");

      setTimeout(() => {
        headlineEl.textContent = headlines[index];
        taglineEl.textContent = taglines[index];
        headlineEl.classList.add("fade-in");
        taglineEl.classList.add("fade-in");
        index = (index + 1) % headlines.length;
      }, 300); // fade out time
    }

    setInterval(updateText, 4000); // Change text every 4 seconds
  });


