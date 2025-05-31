// JavaScript for interactive elements
        document.addEventListener('DOMContentLoaded', function() {
            // Add smooth scrolling to all links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    
                    document.querySelector(this.getAttribute('href')).scrollIntoView({
                        behavior: 'smooth'
                    });
                });
            });

            // Animate cards when they come into view
            const observerOptions = {
                threshold: 0.1
            };

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
            });

            // Add hover effect to cards
            const cards = document.querySelectorAll('.highlight-card, .link-card');
            cards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                });
            });
        });

        // Simple form submission handler (would be replaced with actual form handling)
        function handleContactSubmit(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            e.target.reset();
        }


        // Testimonials
const testimonialItems = document.querySelector('.testimonial-items');
const testimonialItem = document.querySelector('.testimonial-item');
const prevButton = document.querySelector('.carousel-button.prev');
const nextButton = document.querySelector('.carousel-button.next');

if (testimonialItems && testimonialItem) {
    let testimonialItemWidth = testimonialItem.clientWidth;
    let currentIndex = 0;
    let autoSlide = setInterval(nextTestimonial, 5000);

    // Handle window resizing
    window.addEventListener('resize', () => {
        testimonialItemWidth = testimonialItem.clientWidth;
        updateCarousel();
    });

    // Navigation functions
    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonialItems.children.length;
        updateCarousel();
    }

    function prevTestimonial() {
        currentIndex = (currentIndex - 1 + testimonialItems.children.length) % testimonialItems.children.length;
        updateCarousel();
    }

    function updateCarousel() {
        const offset = -currentIndex * testimonialItemWidth;
        testimonialItems.style.transform = `translateX(${offset}px)`;
    }

    // Add event listeners for buttons
    prevButton.addEventListener('click', () => {
        clearInterval(autoSlide);
        prevTestimonial();
        autoSlide = setInterval(nextTestimonial, 5000);
    });

    nextButton.addEventListener('click', () => {
        clearInterval(autoSlide);
        nextTestimonial();
        autoSlide = setInterval(nextTestimonial, 5000);
    });

    // Touch support for mobile
    let startX = 0;
    let isDragging = false;

    testimonialItems.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    testimonialItems.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diffX = startX - currentX;
        testimonialItems.style.transform = `translateX(${-currentIndex * testimonialItemWidth - diffX}px)`;
    });

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

    // Disable buttons and autoplay if there's only one testimonial
    if (testimonialItems.children.length <= 1) {
        prevButton.style.display = 'none';
        nextButton.style.display = 'none';
        clearInterval(autoSlide);
    }
} else {
    console.error('Testimonial carousel elements not found!');
}