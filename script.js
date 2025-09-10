// Firebase configuration and initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase configuration - Replace with your config
const firebaseConfig = {
    apiKey: "AIzaSyDTw_1lOHmIl_gDY3ex-N_l8NLxRzy6AtA",
    authDomain: "poker-tracker-52df8.firebaseapp.com",
    databaseURL: "https://poker-tracker-52df8-default-rtdb.firebaseio.com",
    projectId: "poker-tracker-52df8",
    storageBucket: "poker-tracker-52df8.firebasestorage.app",
    messagingSenderId: "311745459306",
    appId: "1:311745459306:web:4d53385d198139f8d00613",
    measurementId: "G-GZND8S84WX"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firebase database functions
window.submitToWaitlist = async function(email) {
    try {
        await addDoc(collection(db, 'waitlist'), {
            email: email,
            timestamp: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Error adding document: ', error);
        return false;
    }
};

// Enhanced scroll-triggered animation and header color changing
const featuresSection = document.querySelector('.features-section');
const featuresTrigger = document.querySelector('.features-trigger');
const heroSection = document.querySelector('.hero');
const aboutSection = document.querySelector('.about-section');
const header = document.querySelector('.header');
let lastScrollY = window.scrollY;
let isScrollingDown = true;

// Define section colors to match exact section backgrounds
const sectionColors = {
    'hero': 'transparent',
    'features': '#ffd13f', // var(--yellow)
    'about': '#3c315b', // var(--midnightPurple)
    'footer': '#161618' // var(--dark1)
};

// Get current visible section
function getCurrentSection() {
    const sections = [
        { name: 'hero', element: heroSection },
        { name: 'features', element: featuresSection },
        { name: 'about', element: aboutSection },
        { name: 'footer', element: document.querySelector('.footer') }
    ];
    
    const windowHeight = window.innerHeight;
    const headerHeight = header.offsetHeight;
    
    for (const section of sections) {
        if (section.element) {
            const rect = section.element.getBoundingClientRect();
            // Check if section is covering the header area
            if (rect.top <= headerHeight && rect.bottom >= headerHeight) {
                return section.name;
            }
        }
    }
    
    return 'hero'; // Default
}

// Smooth scroll progress tracking
function handleScroll() {
    const currentScrollY = window.scrollY;
    isScrollingDown = currentScrollY > lastScrollY;
    lastScrollY = currentScrollY;
    
    // Get current section and update header color
    const currentSection = getCurrentSection();
    const headerColor = sectionColors[currentSection];
    
    // Remove all section classes
    header.classList.remove('hero-active', 'features-filling', 'about-active', 'footer-active');
    
    // Add current section class and set color
    if (currentSection !== 'hero') {
        header.classList.add(`${currentSection}-active`);
        header.style.setProperty('--fill-height', '100%');
        header.style.setProperty('--header-bg-color', headerColor);
    } else {
        header.style.setProperty('--fill-height', '0%');
        header.style.setProperty('--header-bg-color', 'transparent');
    }
    
    // Handle features section specific animation
    if (featuresTrigger) {
        const triggerRect = featuresTrigger.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        const scrollProgress = Math.max(0, Math.min(1, 
            (windowHeight - triggerRect.top) / windowHeight
        ));
        
        // Fade out hero section as features section slides up
        if (scrollProgress > 0) {
            heroSection.style.opacity = Math.max(0, 1 - scrollProgress * 1.5);
            heroSection.style.transform = `translateY(${-scrollProgress * 2}rem)`;
        } else {
            heroSection.style.opacity = 1;
            heroSection.style.transform = 'translateY(2rem)';
        }
        
        // Control features section activation
        if (scrollProgress > 0.3) {
            featuresSection.classList.add('active');
            featuresSection.classList.remove('scrolled-back');
        } else if (scrollProgress < 0.1) {
            featuresSection.classList.remove('active');
            featuresSection.classList.add('scrolled-back');
        }
    }
}

// Intersection Observer for initial trigger
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            window.addEventListener('scroll', handleScroll, { passive: true });
        } else if (entry.boundingClientRect.top > 0) {
            window.removeEventListener('scroll', handleScroll);
            featuresSection.classList.remove('active');
            header.classList.remove('features-filling');
            header.style.setProperty('--fill-height', '0%');
            heroSection.style.opacity = 1;
            heroSection.style.transform = 'translateY(2rem)';
        }
    });
}, {
    threshold: [0, 0.1, 0.5, 1]
});

observer.observe(featuresTrigger);

// Handle Features navigation link
document.addEventListener('click', function(e) {
    if (e.target.closest('a[href="#features-section"]')) {
        e.preventDefault();
        // Calculate the scroll position needed to fully activate features section
        const triggerRect = featuresTrigger.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        // Scroll past the trigger to ensure complete activation and eliminate any gaps
        const targetScrollY = window.scrollY + triggerRect.top + windowHeight + 100;
        
        window.scrollTo({
            top: targetScrollY,
            behavior: 'smooth'
        });
    }
});

// Waitlist form submission
const waitlistForm = document.getElementById('waitlistForm');
const emailInput = document.getElementById('emailInput');
const submitButton = document.getElementById('submitButton');
const waitlistNote = document.getElementById('waitlistNote');

waitlistForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    if (!email) return;

    // Disable form during submission
    submitButton.disabled = true;
    submitButton.classList.add('loading');

    try {
        const success = await window.submitToWaitlist(email);
        
        if (success) {
            // Trigger flip animation
            submitButton.classList.add('success');
            waitlistNote.textContent = 'Thanks for joining! We\'ll notify you when we launch.';
            waitlistNote.classList.add('success-message');
            
            // Clear email input after success but keep it visible
            emailInput.value = '';
            emailInput.placeholder = 'Email submitted successfully!';
        } else {
            // Handle error
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
            waitlistNote.textContent = 'Something went wrong. Please try again.';
            waitlistNote.classList.add('error-message');
            
            setTimeout(() => {
                waitlistNote.textContent = 'Be the first to know when we launch. No spam, ever.';
                waitlistNote.classList.remove('error-message');
            }, 3000);
        }
    } catch (error) {
        console.error('Submission error:', error);
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
    }
});

// Mobile hamburger menu functionality
const hamburgerMenu = document.getElementById('hamburgerMenu');
const mobileNav = document.getElementById('mobileNav');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

hamburgerMenu.addEventListener('click', function() {
    hamburgerMenu.classList.toggle('active');
    mobileNav.classList.toggle('active');
    
    // Prevent body scrolling when menu is open
    if (mobileNav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// Close mobile menu when clicking on links
mobileNavLinks.forEach(link => {
    link.addEventListener('click', function() {
        hamburgerMenu.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
mobileNav.addEventListener('click', function(e) {
    if (e.target === mobileNav) {
        hamburgerMenu.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Scroll animations for new sections
function animateOnScroll() {
    const sections = document.querySelectorAll('.about-section');
    const stats = document.querySelectorAll('.stat-card');
    const aboutFeatures = document.querySelectorAll('.about-feature');
    
    const animateElements = (elements, className = 'animate-in') => {
        elements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.8;
            
            if (isVisible) {
                setTimeout(() => {
                    element.classList.add(className);
                }, index * 150);
            }
        });
    };
    
    // Animate sections
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;
        
        if (isVisible && !section.classList.contains('section-visible')) {
            section.classList.add('section-visible');
        }
    });
    
    // Animate individual elements
    animateElements(stats, 'stat-animate');
    animateElements(aboutFeatures, 'feature-animate');
}

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const duration = 2000; // 2 seconds
    
    counters.forEach(counter => {
        const target = counter.textContent.replace(/\D/g, '');
        const suffix = counter.textContent.replace(/[0-9]/g, '');
        
        if (target && !counter.hasAnimated) {
            counter.hasAnimated = true;
            let current = 0;
            const increment = target / (duration / 16);
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + suffix;
                }
            };
            
            updateCounter();
        }
    });
}

// Initialize scroll animations
window.addEventListener('scroll', animateOnScroll, { passive: true });
window.addEventListener('load', () => {
    animateOnScroll();
    
    // Animate counters when stats section is visible
    const statsSection = document.querySelector('.stats-grid');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    });
    
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});