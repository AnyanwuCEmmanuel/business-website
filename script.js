// ==============================================
// CodeCraft Studio - Main JavaScript
// ==============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('CodeCraft Studio loaded successfully!');
    
    // Initialize all functionality
    initThemeToggle();
    initMobileMenu();
    initModal();
    initScrollAnimations();
    initContactForm();
    initCredentialsPopup();
    initDashboardFeatures();
});

// ==============================================
// 1. THEME TOGGLE
// ==============================================
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    if (!themeToggle) return;
    
    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        body.classList.add('light');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Toggle theme on click
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('light');
        const isLight = body.classList.contains('light');
        
        // Update icon
        themeToggle.innerHTML = isLight 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
        
        // Save preference
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        // Add animation effect
        themeToggle.style.transform = 'scale(1.2)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 200);
    });
}

// ==============================================
// 2. MOBILE MENU (Hamburger)
// ==============================================
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    // Create overlay for mobile menu
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
    
    // Open menu function
    function openMenu() {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Add animation to menu items
        const menuItems = navMenu.querySelectorAll('li');
        menuItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.style.animationName = 'fadeInUp';
        });
    }
    
    // Close menu function
    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    }
    
    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', closeMenu);
    
    // Close menu when clicking any menu link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close menu when resizing to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Handle mobile sign-in link
    const mobileSignIn = document.getElementById('login-link-mobile');
    if (mobileSignIn) {
        mobileSignIn.addEventListener('click', function(e) {
            e.preventDefault();
            closeMenu();
            
            // Trigger the login modal
            const loginLink = document.getElementById('login-link');
            if (loginLink) {
                setTimeout(() => {
                    loginLink.click();
                }, 300);
            }
        });
    }
}

// ==============================================
// 3. LOGIN/SIGNUP MODAL
// ==============================================
function initModal() {
    const loginLink = document.getElementById('login-link');
    const loginModal = document.getElementById('login-modal');
    
    if (!loginLink || !loginModal) return;
    
    let isSignupMode = false;
    const closeBtn = loginModal.querySelector('.close');
    const form = document.getElementById('login-form');
    const modalTitle = loginModal.querySelector('h2');
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
    
    // Update modal UI based on mode
    function updateModalUI() {
        if (!modalTitle || !submitBtn) return;
        
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
    
    // Open modal
    loginLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'flex';
        isSignupMode = false;
        updateModalUI();
        if (form) form.reset();
    });
    
    // Close modal
    function closeModal() {
        loginModal.style.display = 'none';
        if (form) form.reset();
    }
    
    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            closeModal();
        }
    });
    
    // Close with Escape key
    window.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && loginModal.style.display === 'flex') {
            closeModal();
        }
    });
    
    // Toggle between sign in/sign up
    loginModal.addEventListener('click', function(e) {
        if (e.target.id === 'toggle-auth') {
            e.preventDefault();
            isSignupMode = !isSignupMode;
            updateModalUI();
        }
    });
    
    // Form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            const passwordInput = form.querySelector('input[type="password"]');
            
            if (!emailInput || !passwordInput) return;
            
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            
            // Validation
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
            
            // Generate a nice username from email
            let userName = email.split('@')[0]
                .replace(/[0-9._+-]/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
                .trim() || 'User';
            
            // Save user data
            const userData = {
                email: email,
                name: userName,
                isLoggedIn: true,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');
            
            // Success message
            const isSignup = modalTitle.textContent.includes('Sign Up');
            alert(isSignup 
                ? `Account created successfully! Welcome aboard, ${userName} 🎉` 
                : `Logged in successfully! Welcome back, ${userName} ✨`);
            
            closeModal();
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 600);
        });
    }
}

// ==============================================
// 4. SCROLL ANIMATIONS
// ==============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    document.querySelectorAll('.fade-in, .line-draw').forEach(el => {
        observer.observe(el);
    });
    
    // Add line-draw animation for section headers
    document.querySelectorAll('.line-draw').forEach(el => {
        observer.observe(el);
    });
}

// ==============================================
// 5. CONTACT FORM
// ==============================================
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    // Initialize messaging system
    if (!localStorage.getItem('clientMessages')) {
        localStorage.setItem('clientMessages', JSON.stringify({}));
    }
    if (!localStorage.getItem('approvedUsers')) {
        localStorage.setItem('approvedUsers', JSON.stringify([]));
    }
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('client-name')?.value.trim();
        const email = document.getElementById('client-email')?.value.trim().toLowerCase();
        const message = document.getElementById('client-message')?.value.trim();
        
        // Validation
        if (!name || !email || !message) {
            showMessageStatus('Please fill in all fields', 'error');
            return;
        }
        if (!email.includes('@')) {
            showMessageStatus('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // Save message to localStorage
            saveClientMessage(name, email, message);
            
            // Send to Formspree
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Show credentials popup
                showCredentialsPopup(email);
                
                // Save email for dashboard access
                localStorage.setItem('lastContactEmail', email);
                
                // Reset form
                contactForm.reset();
                
                showMessageStatus('Message sent successfully!', 'success');
            } else {
                showMessageStatus('Something went wrong. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            showMessageStatus('Network error. Please check your connection.', 'error');
        } finally {
            // Restore button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ==============================================
// 6. MESSAGING SYSTEM FUNCTIONS
// ==============================================
function saveClientMessage(name, email, message, subject = 'New Inquiry') {
    let allMessages = JSON.parse(localStorage.getItem('clientMessages')) || {};
    let approvedUsers = JSON.parse(localStorage.getItem('approvedUsers')) || [];
    
    // Create user entry if it doesn't exist
    if (!allMessages[email]) {
        allMessages[email] = {
            name: name,
            messages: []
        };
    }
    
    // Add client's message
    const clientMessage = {
        id: Date.now(),
        from: 'client',
        text: message,
        time: new Date().toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        subject: subject,
        read: false
    };
    
    allMessages[email].messages.push(clientMessage);
    
    // Add auto-reply from Emmanuel
    const autoReply = {
        id: Date.now() + 1,
        from: 'emmanuel',
        text: `Hi ${name}! Thanks for your message about "${subject}". I've received it and will get back to you within 24 hours.`,
        time: new Date().toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        subject: `Re: ${subject}`,
        read: false
    };
    
    allMessages[email].messages.push(autoReply);
    
    // Save to localStorage
    localStorage.setItem('clientMessages', JSON.stringify(allMessages));
    
    // Add to approved users if not already there
    if (!approvedUsers.includes(email)) {
        approvedUsers.push(email);
        localStorage.setItem('approvedUsers', JSON.stringify(approvedUsers));
    }
    
    return true;
}

function getUserMessages(email) {
    const allMessages = JSON.parse(localStorage.getItem('clientMessages')) || {};
    return allMessages[email] ? allMessages[email].messages : [];
}

function displayUserMessages(email) {
    const container = document.getElementById('messages-container');
    if (!container) return;
    
    const messages = getUserMessages(email);
    
    if (messages.length === 0) {
        container.innerHTML = `
            <div class="empty-messages fade-in">
                <i class="fas fa-comments"></i>
                <h3>No messages yet</h3>
                <p>Send your first message to start a conversation!</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    messages.forEach(msg => {
        const isFromClient = msg.from === 'client';
        const senderClass = isFromClient ? 'client' : 'emmanuel';
        const messageClass = isFromClient ? 'from-client' : 'from-emmanuel';
        
        html += `
            <div class="message-item ${messageClass} fade-in">
                <div class="message-header">
                    <span class="message-sender ${senderClass}">
                        ${isFromClient ? 'You' : 'Emmanuel'}
                    </span>
                    <span class="message-time">${msg.time}</span>
                </div>
                <div class="message-text">${msg.text}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ==============================================
// 7. CREDENTIALS POPUP
// ==============================================
function initCredentialsPopup() {
    const popup = document.getElementById('credentials-popup');
    if (!popup) return;
    
    // Close button
    const closeBtn = popup.querySelector('.popup-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCredentialsPopup);
    }
    
    // Copy buttons
    popup.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('onclick').match(/'(.*?)'/)[1];
            copyToClipboard(targetId);
        });
    });
    
    // Close popup when clicking outside
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            closeCredentialsPopup();
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
            closeCredentialsPopup();
        }
    });
}

function showCredentialsPopup(email) {
    const popup = document.getElementById('credentials-popup');
    const emailEl = document.getElementById('popup-email-display');
    
    if (emailEl) emailEl.textContent = email;
    if (popup) popup.classList.add('active');
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
}

function closeCredentialsPopup() {
    const popup = document.getElementById('credentials-popup');
    if (popup) popup.classList.remove('active');
    
    // Restore scrolling
    document.body.style.overflow = '';
}

function goToDashboard() {
    closeCredentialsPopup();
    window.location.href = 'dashboard.html';
}

// ==============================================
// 8. COPY TO CLIPBOARD
// ==============================================
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const text = element.textContent.trim();
    
    navigator.clipboard.writeText(text).then(() => {
        // Show success feedback
        const btn = document.querySelector(`[onclick*="${elementId}"]`);
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            btn.style.background = '#10b981';
            btn.style.color = 'white';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.color = '';
            }, 2000);
        }
    }).catch(err => {
        console.error('Copy failed:', err);
        alert('Failed to copy text. Please select and copy manually.');
    });
}

// ==============================================
// 9. DASHBOARD FEATURES
// ==============================================
function initDashboardFeatures() {
    // Only run on dashboard page
    if (!window.location.pathname.includes('dashboard.html') && 
        !document.title.toLowerCase().includes('dashboard')) {
        return;
    }
    
    // Personalize dashboard
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if (userData && userData.isLoggedIn) {
        // Update user name in all places
        document.querySelectorAll('.user-name').forEach(element => {
            element.textContent = userData.name;
        });
        
        // Update greeting
        const greetingElement = document.querySelector('.user-greeting');
        if (greetingElement) {
            greetingElement.textContent = `Welcome back, ${userData.name}`;
        }
        
        // Update page title
        document.title = `${userData.name}'s Dashboard - CodeCraft Studio`;
        
        // Load user messages
        displayUserMessages(userData.email);
    } else {
        // Set to guest mode
        document.querySelectorAll('.user-name').forEach(element => {
            element.textContent = 'Guest';
        });
        
        const greetingElement = document.querySelector('.user-greeting');
        if (greetingElement) {
            greetingElement.textContent = 'Welcome, Guest';
        }
    }
    
    // Logout functionality
    document.querySelectorAll('.sign-in-btn').forEach(btn => {
        if (btn.textContent.includes('Logout') || btn.textContent.includes('Sign Out')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (confirm('Are you sure you want to logout?')) {
                    localStorage.removeItem('userData');
                    localStorage.removeItem('isLoggedIn');
                    alert('Logged out successfully!');
                    window.location.href = 'index.html';
                }
            });
        }
    });
    
    // Dashboard message form
    const dashboardForm = document.getElementById('dashboard-message-form');
    if (dashboardForm) {
        dashboardForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const subject = document.getElementById('new-subject')?.value.trim();
            const message = document.getElementById('new-message')?.value.trim();
            const userData = JSON.parse(localStorage.getItem('userData'));
            
            if (!subject || !message) {
                alert('Please fill both subject and message');
                return;
            }
            
            if (userData?.email) {
                saveClientMessage(userData.name, userData.email, message, subject);
                alert('Message sent! I\'ll reply soon.');
                dashboardForm.reset();
                displayUserMessages(userData.email);
            } else {
                alert('Please login to send messages');
            }
        });
    }
}

// ==============================================
// 10. UTILITY FUNCTIONS
// ==============================================
function showMessageStatus(message, type = 'info') {
    // Remove existing status message
    const existingStatus = document.querySelector('.message-status');
    if (existingStatus) {
        existingStatus.remove();
    }
    
    // Create new status element
    const statusEl = document.createElement('div');
    statusEl.className = `message-status ${type}`;
    statusEl.innerHTML = `
        ${message}
        <button class="message-close">&times;</button>
    `;
    
    // Insert after contact form title
    const contactSection = document.querySelector('#contact .container');
    if (contactSection) {
        const title = contactSection.querySelector('h2');
        if (title) {
            title.parentNode.insertBefore(statusEl, title.nextSibling);
        }
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (statusEl.parentNode) {
            statusEl.remove();
        }
    }, 5000);
    
    // Close button
    statusEl.querySelector('.message-close').addEventListener('click', function() {
        statusEl.remove();
    });
}

// ==============================================
// 11. INITIAL SCROLL FIX FOR MOBILE
// ==============================================
// Fix for mobile scroll restoration
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Scroll to top on page load
window.addEventListener('load', () => {
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, 100);
});

// ==============================================
// 12. SMOOTH SCROLL FOR ANCHOR LINKS
// ==============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just "#"
        if (href === '#') return;
        
        const targetElement = document.querySelector(href);
        if (targetElement) {
            e.preventDefault();
            
            // Close mobile menu if open
            const navMenu = document.getElementById('nav-menu');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                document.querySelector('.menu-overlay')?.classList.remove('active');
                document.querySelector('.hamburger')?.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            // Smooth scroll to target
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Account for fixed nav
                behavior: 'smooth'
            });
        }
    });
});

// ==============================================
// 13. PERFORMANCE OPTIMIZATIONS
// ==============================================
// Debounce scroll events
let scrollTimer;
window.addEventListener('scroll', function() {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function() {
        // Any scroll-related code here
    }, 100);
});

// Prevent form double submission
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function() {
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            setTimeout(() => {
                submitBtn.disabled = false;
            }, 3000);
        }
    });
});
// ==============================================
// 9. DASHBOARD FEATURES - UPDATED VERSION
// ==============================================
function initDashboardFeatures() {
    // Only run on dashboard page
    const isDashboard = window.location.pathname.includes('dashboard.html') || 
                       document.title.toLowerCase().includes('dashboard');
    
    if (!isDashboard) return;
    
    console.log('Initializing dashboard features...');
    
    // Get user data
    const userData = JSON.parse(localStorage.getItem('userData'));
    const lastContactEmail = localStorage.getItem('lastContactEmail');
    
    // Determine which email to use
    let userEmail = '';
    if (userData && userData.email) {
        userEmail = userData.email;
    } else if (lastContactEmail) {
        userEmail = lastContactEmail;
    } else {
        // Try to get email from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        userEmail = urlParams.get('email') || '';
    }
    
    // Personalize dashboard
    if (userData && userData.isLoggedIn) {
        // Update user name
        document.querySelectorAll('.user-name').forEach(element => {
            element.textContent = userData.name;
        });
        
        // Update greeting
        const greetingElement = document.querySelector('.user-greeting');
        if (greetingElement) {
            greetingElement.textContent = `Welcome back, ${userData.name}`;
        }
        
        // Update page title
        document.title = `${userData.name}'s Dashboard - CodeCraft Studio`;
        
        // Display user email
        const emailDisplay = document.getElementById('user-email-display');
        if (emailDisplay) {
            emailDisplay.innerHTML = `You're logged in as <strong>${userEmail}</strong>. This is your personal area to manage projects, view messages, and more.`;
        }
        
        // Update credentials display
        const emailDisplayCred = document.getElementById('email-display');
        if (emailDisplayCred) {
            emailDisplayCred.textContent = userEmail;
        }
        
        // Load user messages
        console.log('Loading messages for email:', userEmail);
        displayUserMessages(userEmail);
        
    } else {
        // Guest mode
        document.querySelectorAll('.user-name').forEach(element => {
            element.textContent = 'Guest';
        });
        
        const greetingElement = document.querySelector('.user-greeting');
        if (greetingElement) {
            greetingElement.textContent = 'Welcome, Guest';
        }
        
        // Show credentials if email exists
        if (userEmail) {
            const emailDisplayCred = document.getElementById('email-display');
            if (emailDisplayCred) {
                emailDisplayCred.textContent = userEmail;
            }
            
            // Load messages for this email
            displayUserMessages(userEmail);
        } else {
            // No email found, show message
            const messagesContainer = document.getElementById('messages-container');
            if (messagesContainer) {
                messagesContainer.innerHTML = `
                    <div class="empty-messages fade-in">
                        <i class="fas fa-user-slash"></i>
                        <h3>Not Logged In</h3>
                        <p>Please login or send a message from the contact form to see your messages.</p>
                        <a href="index.html" class="cta-btn" style="margin-top: 20px;">Go to Contact Form</a>
                    </div>
                `;
            }
        }
    }
    
    // Logout functionality
    document.querySelectorAll('.logout-btn, .logout-mobile').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('userData');
                localStorage.removeItem('isLoggedIn');
                alert('Logged out successfully!');
                window.location.href = 'index.html';
            }
        });
    });
    
    // Dashboard message form
    const dashboardForm = document.getElementById('dashboard-message-form');
    if (dashboardForm) {
        dashboardForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const subject = document.getElementById('new-subject')?.value.trim();
            const message = document.getElementById('new-message')?.value.trim();
            
            if (!subject || !message) {
                alert('Please fill both subject and message');
                return;
            }
            
            // Get user email from localStorage
            const userData = JSON.parse(localStorage.getItem('userData'));
            const lastContactEmail = localStorage.getItem('lastContactEmail');
            const userEmail = userData?.email || lastContactEmail;
            
            if (!userEmail) {
                alert('Please login or send a message from the contact form first');
                window.location.href = 'index.html#contact';
                return;
            }
            
            const userName = userData?.name || 'Guest';
            
            try {
                // Save message locally
                saveClientMessage(userName, userEmail, message, subject);
                
                // Also send to Formspree
                const formData = new FormData(dashboardForm);
                const response = await fetch(dashboardForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                
                if (response.ok) {
                    alert('Message sent to Emmanuel! I\'ll reply soon.');
                    dashboardForm.reset();
                    displayUserMessages(userEmail);
                } else {
                    alert('Message saved locally but could not be sent. Please try again.');
                }
            } catch (error) {
                console.error('Error sending message:', error);
                alert('Error sending message. Please try again.');
            }
        });
    }
}

// Update the displayUserMessages function to be more robust
function displayUserMessages(email) {
    const container = document.getElementById('messages-container');
    if (!container) {
        console.error('Messages container not found');
        return;
    }
    
    console.log('Displaying messages for:', email);
    
    const messages = getUserMessages(email);
    console.log('Found messages:', messages);
    
    if (!messages || messages.length === 0) {
        container.innerHTML = `
            <div class="empty-messages fade-in">
                <i class="fas fa-comments"></i>
                <h3>No messages yet</h3>
                <p>Send your first message to start a conversation with Emmanuel!</p>
                <p style="margin-top: 15px; font-size: 0.9rem; color: #94a3b8;">
                    <i class="fas fa-info-circle"></i> Send a message using the form below
                </p>
            </div>
        `;
        return;
    }
    
    // Sort messages by time (newest first)
    const sortedMessages = [...messages].sort((a, b) => b.id - a.id);
    
    let html = '';
    sortedMessages.forEach(msg => {
        const isFromClient = msg.from === 'client';
        const senderClass = isFromClient ? 'client' : 'emmanuel';
        const messageClass = isFromClient ? 'from-client' : 'from-emmanuel';
        const senderName = isFromClient ? 'You' : 'Emmanuel';
        const senderIcon = isFromClient ? 'fas fa-user' : 'fas fa-user-tie';
        
        html += `
            <div class="message-item ${messageClass} fade-in">
                <div class="message-header">
                    <span class="message-sender ${senderClass}">
                        <i class="${senderIcon}"></i> ${senderName}
                    </span>
                    <span class="message-time">${msg.time}</span>
                </div>
                ${msg.subject ? `<div class="message-subject">Subject: ${msg.subject}</div>` : ''}
                <div class="message-text">${msg.text}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Scroll to bottom of messages
    setTimeout(() => {
        container.scrollTop = container.scrollHeight;
    }, 100);
}
// ==============================================
// DASHBOARD FORM HANDLER - FORMSPREE
// ==============================================

document.addEventListener('DOMContentLoaded', function() {
    const dashboardForm = document.getElementById('dashboard-message-form');
    
    if (dashboardForm) {
        dashboardForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const form = this;
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Get user data
            const userData = JSON.parse(localStorage.getItem('userData'));
            const lastEmail = localStorage.getItem('lastContactEmail');
            const userEmail = userData?.email || lastEmail;
            const userName = userData?.name || 'Guest';
            const subject = document.getElementById('new-subject').value.trim();
            const message = document.getElementById('new-message').value.trim();
            
            // Validation
            if (!userEmail) {
                alert('Please login or send a message from contact form first');
                return;
            }
            
            if (!subject || !message) {
                alert('Please fill both subject and message');
                return;
            }
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                // ==============================================
                // STEP 1: PREPARE FORM DATA FOR FORMSPREE
                // ==============================================
                
                // Set reply-to email (CRITICAL for Formspree)
                document.getElementById('dashboard-replyto').value = userEmail;
                
                // Set client info
                document.getElementById('dashboard-client-name').value = userName;
                document.getElementById('dashboard-client-email').value = userEmail;
                
                // Create FormData
                const formData = new FormData(form);
                
                // ==============================================
                // STEP 2: SEND TO FORMSPREE (THIS SENDS EMAIL TO YOU)
                // ==============================================
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                
                const result = await response.json();
                
                // ==============================================
                // STEP 3: HANDLE RESPONSE
                // ==============================================
                if (response.ok && result.success) {
                    // SUCCESS! Email was sent to you
                    
                    // Save message locally for dashboard display
                    saveClientMessage(userName, userEmail, message, subject);
                    
                    // Show success message
                    alert('✅ Message sent successfully to Emmanuel! Check your email for replies.');
                    
                    // Reset form
                    form.reset();
                    
                    // Refresh messages display
                    displayUserMessages(userEmail);
                    
                } else {
                    // Formspree returned an error
                    
                    // Save locally anyway
                    saveClientMessage(userName, userEmail, message, subject);
                    
                    // Show appropriate message
                    if (result.errors && result.errors._form) {
                        alert('⚠️ ' + result.errors._form + ' Message saved locally.');
                    } else {
                        alert('⚠️ Message saved locally but email failed. You can view it below.');
                    }
                    
                    form.reset();
                    displayUserMessages(userEmail);
                }
                
            } catch (error) {
                // Network or other error
                console.error('Network error:', error);
                
                // Save locally on network failure
                saveClientMessage(userName, userEmail, message, subject);
                
                alert('🌐 Network issue. Message saved locally! You can view it below.');
                
                form.reset();
                displayUserMessages(userEmail);
                
            } finally {
                // Restore button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

// ==============================================
// INITIALIZE DASHBOARD
// ==============================================

// This should be in your existing initDashboardFeatures function
function initDashboardFeatures() {
    // Get user data
    const userData = JSON.parse(localStorage.getItem('userData'));
    const lastContactEmail = localStorage.getItem('lastContactEmail');
    
    let userEmail = '';
    if (userData && userData.email) {
        userEmail = userData.email;
    } else if (lastContactEmail) {
        userEmail = lastContactEmail;
    }
    
    // Personalize dashboard
    if (userData && userData.isLoggedIn) {
        // Update user name
        document.querySelectorAll('.user-name').forEach(element => {
            element.textContent = userData.name;
        });
        
        // Update greeting
        const greetingElement = document.querySelector('.user-greeting');
        if (greetingElement) {
            greetingElement.textContent = `Welcome back, ${userData.name}`;
        }
        
        // Display user email
        const emailDisplay = document.getElementById('user-email-display');
        if (emailDisplay) {
            emailDisplay.innerHTML = `You're logged in as <strong>${userEmail}</strong>. This is your personal area to manage projects, view messages, and more.`;
        }
        
        // Update credentials display
        const emailDisplayCred = document.getElementById('email-display');
        if (emailDisplayCred && userEmail) {
            emailDisplayCred.textContent = userEmail;
        }
        
        // Load user messages
        displayUserMessages(userEmail);
        
    } else if (userEmail) {
        // Guest mode but with email
        const emailDisplayCred = document.getElementById('email-display');
        if (emailDisplayCred) {
            emailDisplayCred.textContent = userEmail;
        }
        displayUserMessages(userEmail);
    }
    
    // Logout functionality
    document.querySelectorAll('.logout-btn, .logout-mobile').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('userData');
                localStorage.removeItem('isLoggedIn');
                alert('Logged out successfully!');
                window.location.href = 'index.html';
            }
        });
    });
}
