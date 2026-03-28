// Sticky Navbar functionality
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Reveal Animations using Intersection Observer
const sections = document.querySelectorAll('.section');

const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px'
};

const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // We do not unobserve because we want elements to animate every time they come into viewport
            // sectionObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Update active nav links on scroll
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    // Check which section is currently on screen
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });
    
    // If we are at the very top, Home is active
    if (window.scrollY < 300) {
        current = 'home';
    }

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Modal handling
const modal = document.getElementById('confirmation-modal');
const closeModal = document.getElementById('close-modal');

if (closeModal) {
    closeModal.addEventListener('click', () => {
        modal.classList.remove('show');
    });
}

// Close modal when clicking outside of it
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

// Form submission handler
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const btn = contactForm.querySelector('button');
    const originalText = btn.textContent;
    
    btn.textContent = 'Sending...';
    btn.style.opacity = '0.8';
    
    const formData = new FormData(contactForm);
    const params = new URLSearchParams();
    for (const pair of formData) {
        params.append(pair[0], pair[1]);
    }

    fetch(contactForm.action, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
    })
    .then(() => {
        btn.textContent = 'Message Sent Successfully!';
        btn.style.background = '#10b981'; // Success green
        contactForm.reset();
        
        // Show confirmation modal
        if (modal) {
            modal.classList.add('show');
        }
        
        // Reset button after 3 seconds
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.opacity = '1';
        }, 3000);
    })
    .catch((error) => {
        console.error('Error submitting form:', error);
        btn.textContent = 'Error Sending';
        btn.style.background = '#ef4444'; // Error red
        
        // Reset button after 3 seconds
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.opacity = '1';
        }, 3000);
    });
});
