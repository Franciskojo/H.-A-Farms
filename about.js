// Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });

    // Gallery lightbox functionality
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        // In a real implementation, this would open a lightbox/modal
        alert('Image clicked! This would open a larger view in a real implementation.');
      });
    });

    // Team member hover effect enhancement
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
      member.addEventListener('mouseenter', () => {
        member.querySelector('img').style.transform = 'scale(1.1)';
        member.querySelector('h3').style.color = 'var(--accent-color)';
      });
      member.addEventListener('mouseleave', () => {
        member.querySelector('img').style.transform = 'scale(1)';
        member.querySelector('h3').style.color = 'var(--primary-color)';
      });
    });
