// script.js - Portfolio Website

// ==============================================
// THEME TOGGLE & PERSISTENCE
// ==============================================
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Apply saved theme FIRST (prevents flash of wrong theme)
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
    body.classList.add('light');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
} else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
}

// Toggle handler
themeToggle.addEventListener('click', () => {
    body.classList.toggle('light');
    
    const isLight = body.classList.contains('light');
    themeToggle.innerHTML = isLight 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
        
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// ==============================================
// MOBILE MENU (Hamburger)
// ==============================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking any link
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        link.blur(); // Helps with mobile focus outline persistence
    });
});

// ==============================================
// LOGIN / SIGNUP MODAL
// ==============================================
const loginLink = document.getElementById('login-link');
const loginModal = document.getElementById('login-modal');
const closeBtn = loginModal.querySelector('.close');
const modalTitle = loginModal.querySelector('h2');
const submitBtn = loginModal.querySelector('button[type="submit"]');
const form = document.getElementById('login-form');
const navLoginLink = document.getElementById('login-link');

let isSignupMode = false;

function updateModalUI() {
    if (isSignupMode) {
        modalTitle.textContent = 'Sign Up';
        submitBtn.textContent = 'Create Account';
        loginModal.querySelector('p').innerHTML = 
            'Already have an account? <a href="#" id="toggle-auth">Sign In</a>';
    } else {
        modalTitle.textContent = 'Sign In';
        submitBtn.textContent = 'Login';
        loginModal.querySelector('p').innerHTML = 
            'No account? <a href="#" id="toggle-auth">Sign Up</a>';
    }
}

// Single delegated click handler for toggle link (more reliable)
loginModal.addEventListener('click', function(e) {
    if (e.target.id === 'toggle-auth') {
        e.preventDefault();
        isSignupMode = !isSignupMode;
        updateModalUI();
    }
});

// Open modal
loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'flex';
    isSignupMode = false;
    updateModalUI();
    form.reset();
});

// Close modal
function closeModal() {
    loginModal.style.display = 'none';
    form.reset();
}

closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    if (e.target === loginModal) closeModal();
});

// Close with Escape key (accessibility)
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && loginModal.style.display === 'flex') {
        closeModal();
    }
});

// ==============================================
// FAKE AUTHENTICATION & NAV UPDATE
// ==============================================
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = form.querySelector('input[type="email"]').value.trim();
    const password = form.querySelector('input[type="password"]').value;

    // Basic validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    if (!email.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }

    // Fake success
    alert(isSignupMode 
        ? 'Account created successfully! Welcome aboard 🎉' 
        : 'Logged in successfully! Welcome back 😊');

    // Update navigation (fake logged-in state)
    navLoginLink.textContent = 'Dashboard';
    navLoginLink.href = '#dashboard'; // can be changed later to real route

    closeModal();
});

// ==============================================
// SCROLL FADE-IN ANIMATION
// ==============================================
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after animation to improve performance
                // observer.unobserve(entry.target);
            }
        });
    }, 
    { threshold: 0.1 }
);

document.querySelectorAll('.fade-in, .line-draw').forEach(el => {
    observer.observe(el);
});
// Force scroll to top on page load/refresh (especially important on mobile)
window.addEventListener('load', () => {
    // Small delay helps with mobile browsers that restore scroll position
    setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;        // For Safari
        document.documentElement.scrollTop = 0;
    }, 100);
});
// Prevent automatic scroll restoration
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Force instant scroll to top on every load
window.addEventListener('load', () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Extra insurance (10ms is basically instant)
    setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 10);
});