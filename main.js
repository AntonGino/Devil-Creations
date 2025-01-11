const menuIcon = document.querySelector('.menu-icon');
const mobileNav = document.querySelector('.mobile-nav');

menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : 'auto';
});

// Close menu when clicking a link
document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
        menuIcon.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

function handleLogoAnimation() {
    const logos = document.querySelectorAll('.logo-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.1 });

    logos.forEach(logo => observer.observe(logo));
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', handleLogoAnimation);

// Initialize Email.js with config
fetch('emailjs-config.json')
    .then(response => response.json())
    .then(config => {
        emailjs.init(config.emailjs.userID);

        // Handle newsletter form submission
        document.getElementById('newsletter-form').addEventListener('submit', function(event) {
            event.preventDefault();

            const btn = this.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'Subscribing...';
            btn.disabled = true;

            const userEmail = this.querySelector('input[name="user_email"]').value;

            // Use config values from JSON
            emailjs.send(
                config.emailjs.serviceID,
                config.emailjs.templateID,
                {
                    to_email: userEmail,
                    to_name: config.emailjs.templateParams.to_name,
                    from_name: config.emailjs.templateParams.from_name,
                    message: config.emailjs.templateParams.message
                }
            )
            .then(() => {
                btn.textContent = 'Subscribed';
                btn.disabled = true;
                btn.style.background = '#4CAF50';
                btn.style.cursor = 'default';
                this.querySelector('input').disabled = true;
                
                // Show custom popup
                const popup = document.getElementById('subscribePopup');
                const subscriberEmail = document.querySelector('.subscriber-email');
                subscriberEmail.textContent = userEmail;
                popup.classList.add('active');
                
                // Close popup when clicking close button
                document.querySelector('.popup-close').addEventListener('click', () => {
                    popup.classList.remove('active');
                });

                // Close popup when clicking outside
                popup.addEventListener('click', (e) => {
                    if (e.target === popup) {
                        popup.classList.remove('active');
                    }
                });

                // Update email template parameters
                emailjs.send(
                    config.emailjs.serviceID,
                    config.emailjs.templateID,
                    {
                        to_email: userEmail,
                        to_name: config.emailjs.templateParams.to_name,
                        from_name: config.emailjs.templateParams.from_name,
                        message: `Thank you for subscribing to our newsletter! We'll keep you updated with the latest AI innovations.
                        
Subscribed Email: ${userEmail}`
                    }
                );
            })
            .catch((error) => {
                console.log('Error:', error);
                btn.textContent = originalText;
                btn.disabled = false;
                alert('Sorry, there was an error. Please try again.');
            });
        });
    });

// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Hero section animations
gsap.from('.hero-content h1, .hero-content p, .lightning-btn', {
    scrollTrigger: {
        trigger: '#hero',
        start: 'top center',
        end: 'bottom top',
        toggleActions: 'play reverse play reverse'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power4.out"
});

// Products section animations
gsap.from('#products h2', {
    scrollTrigger: {
        trigger: '#products',
        start: 'top center+=100',
        end: 'top top',
        toggleActions: 'play reverse play reverse'
    },
    y: 30,
    opacity: 0,
    duration: 0.8
});

gsap.from('.card', {
    scrollTrigger: {
        trigger: '#products',
        start: 'top center',
        end: 'bottom top',
        toggleActions: 'play reverse play reverse'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2
});

// Tech Stack section animations - only appear, no disappear
gsap.from('#tech-stack h2', {
    scrollTrigger: {
        trigger: '#tech-stack',
        start: 'top center+=100',
        toggleActions: 'play none none none'
    },
    y: 30,
    opacity: 0,
    duration: 0.8
});

// Support section animations
gsap.from('#support h2', {
    scrollTrigger: {
        trigger: '#support',
        start: 'top center+=100',
        end: 'top top',
        toggleActions: 'play reverse play reverse'
    },
    y: 30,
    opacity: 0,
    duration: 0.8
});

gsap.from('.support-card', {
    scrollTrigger: {
        trigger: '#support',
        start: 'top center',
        end: 'bottom top',
        toggleActions: 'play reverse play reverse'
    },
    y: 50,
    opacity: 0,
    duration: 0.8
});

// About section animations
gsap.from('#about h2', {
    scrollTrigger: {
        trigger: '#about',
        start: 'top center+=100',
        end: 'top top',
        toggleActions: 'play reverse play reverse'
    },
    y: 30,
    opacity: 0,
    duration: 0.8
});

gsap.from('.about-content p', {
    scrollTrigger: {
        trigger: '#about',
        start: 'top center',
        end: 'bottom top',
        toggleActions: 'play reverse play reverse'
    },
    y: 30,
    opacity: 0,
    duration: 0.8
});

// Footer animations - only appear, no disappear
gsap.from('.footer-section', {
    scrollTrigger: {
        trigger: 'footer',
        start: 'top bottom',
        toggleActions: 'play none none none'
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2
});

gsap.from('.footer-bottom', {
    scrollTrigger: {
        trigger: '.footer-bottom',
        start: 'top bottom',
        toggleActions: 'play none none none'
    },
    y: 30,
    opacity: 0,
    duration: 0.8
});