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

// Enhanced scroll-triggered animation for features section
const featuresSection = document.querySelector('.features-section');
const featuresTrigger = document.querySelector('.features-trigger');
const heroSection = document.querySelector('.hero');
const header = document.querySelector('.header');
let lastScrollY = window.scrollY;
let isScrollingDown = true;

// Smooth scroll progress tracking
function handleScroll() {
    const currentScrollY = window.scrollY;
    isScrollingDown = currentScrollY > lastScrollY;
    lastScrollY = currentScrollY;
    
    const triggerRect = featuresTrigger.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const headerRect = header.getBoundingClientRect();
    const headerBottom = headerRect.bottom;
    
    // Calculate scroll progress through the trigger area
    const scrollProgress = Math.max(0, Math.min(1, 
        (windowHeight - triggerRect.top) / windowHeight
    ));
    
    // Calculate when features section top reaches header bottom
    const featuresContentRect = document.querySelector('.features-content').getBoundingClientRect();
    const fillProgress = Math.max(0, Math.min(1,
        (headerBottom - featuresContentRect.top) / headerBottom
    ));
    
    // Fade out hero section as features section slides up
    if (scrollProgress > 0) {
        heroSection.style.opacity = Math.max(0, 1 - scrollProgress * 1.5);
        heroSection.style.transform = `translateY(${-scrollProgress * 2}rem)`;
    } else {
        heroSection.style.opacity = 1;
        heroSection.style.transform = 'translateY(2rem)';
    }
    
    // Control features section activation and header fill together
    if (scrollProgress > 0.15) {
        featuresSection.classList.add('active');
        featuresSection.classList.remove('scrolled-back');
        header.classList.add('features-filling');
        header.style.setProperty('--fill-height', '100%');
    } else if (scrollProgress < 0.05 && !isScrollingDown) {
        featuresSection.classList.remove('active');
        featuresSection.classList.add('scrolled-back');
        header.classList.remove('features-filling');
        header.style.setProperty('--fill-height', '0%');
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