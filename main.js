// Preloader
window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
        
        // Initialize GSAP Animations after preloader
        if (typeof gsap !== 'undefined') {
            initAnimations();
        }
    }, 1800); // Gives time to show the cool glitch animation
});

// Navigation Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Toggle icon between bars and times
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Close mobile menu when link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

// Load Portfolio Items from LocalStorage
function loadPortfolio() {
    const container = document.getElementById('portfolio-container');
    if (!container) return; // Not on home page

    const items = JSON.parse(localStorage.getItem('ks_events_portfolio')) || [];

    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-portfolio">
                <h3>More amazing events coming soon!</h3>
                <p style="margin-top: 10px;">Stay tuned for our latest updates and past work.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    // Reverse to show newest first
    items.reverse().forEach(item => {
        // High quality default image if none provided
        const defaultImg = 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
        const imgSrc = item.image && item.image.trim() !== '' ? item.image : defaultImg;
        
        const div = document.createElement('div');
        div.className = 'portfolio-item';
        div.innerHTML = `
            <div style="overflow: hidden;">
                <img src="${imgSrc}" alt="${item.title}" class="portfolio-img" onerror="this.src='${defaultImg}'">
            </div>
            <div class="portfolio-content">
                <h3 class="portfolio-title">${item.title}</h3>
                <a href="${item.fbLink}" target="_blank" class="portfolio-link">
                    <i class="fab fa-facebook"></i> View on Facebook
                </a>
            </div>
        `;
        container.appendChild(div);
    });
}

// GSAP Scroll Animations
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animation
    gsap.from(".hero-title", { y: 50, opacity: 0, duration: 1, ease: "power3.out" });
    gsap.from(".hero-subtitle", { y: 30, opacity: 0, duration: 1, delay: 0.3, ease: "power3.out" });
    gsap.from(".hero .btn", { scale: 0.8, opacity: 0, duration: 0.5, delay: 0.6, ease: "back.out(1.7)" });

    // Section Titles
    gsap.utils.toArray(".section-title").forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 90%",
            },
            y: 30,
            opacity: 0,
            duration: 0.8
        });
    });

    // About Section
    gsap.from(".about-text", {
        scrollTrigger: { trigger: ".about-content", start: "top 80%" },
        x: -50, opacity: 0, duration: 1
    });
    
    gsap.from(".about-image", {
        scrollTrigger: { trigger: ".about-content", start: "top 80%" },
        x: 50, opacity: 0, duration: 1
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70, // Offset for fixed navbar
                behavior: 'smooth'
            });
        }
    });
});

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    loadPortfolio();
    initCounters();
});

// Animate Counters
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 100; // The lower the slower

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText.replace(/\+/g, '').replace(/,/g, '');
                    
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc).toLocaleString() + '+';
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = target.toLocaleString() + '+';
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        observer.observe(counter);
    });
}
