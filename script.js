document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Current Year Footer ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- 2. Theme Toggle (Light/Dark) ---
    // (Removed per user request to stick to a clean white and blue theme only)

    // --- 3. Mobile Hamburger Menu ---
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when navigation link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // --- 4. Scroll Header Effects ---
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 4b. Sliding Nav Indicator ---
    const navIndicator = document.getElementById('nav-indicator');

    function moveIndicator(linkEl) {
        if (!navIndicator || !linkEl || window.innerWidth < 768) return;
        const menuRect = navMenu.getBoundingClientRect();
        const linkRect = linkEl.getBoundingClientRect();
        navIndicator.style.left  = (linkRect.left - menuRect.left) + 'px';
        navIndicator.style.width = linkRect.width + 'px';
    }

    // Initial position on active link
    requestAnimationFrame(() => {
        const initialActive = document.querySelector('.nav-link.active');
        moveIndicator(initialActive);
    });

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => moveIndicator(link));
    });

    navMenu.addEventListener('mouseleave', () => {
        moveIndicator(document.querySelector('.nav-link.active'));
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // --- 5. Hero Typewriter Text Effect ---

    const words = ["Java Developer", "React Developer", "Backend Engineer", "CSE Graduate", "Problem Solver"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typedTextSpan = document.getElementById('typed-text');
    let typingDelay = 150;

    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typedTextSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingDelay = 70; // Delete faster
        } else {
            typedTextSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingDelay = 150;
        }

        // If word finished typing
        if (!isDeleting && charIndex === currentWord.length) {
            typingDelay = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingDelay = 500; // Pause before typing next word
        }

        setTimeout(typeEffect, typingDelay);
    }
    
    if (typedTextSpan) {
        setTimeout(typeEffect, 1000);
    }

    // --- 6. Scroll Reveal Animation using Intersection Observer ---
    const reveals = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it contains stats, animate counter numbers
                // Check both the element itself and its closest parent section
                const parentSection = entry.target.closest('section');
                const sectionId = entry.target.id || (parentSection ? parentSection.id : '');
                if (sectionId === 'achievements' || sectionId === 'about') {
                    animateStats(entry.target);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach(element => {
        revealObserver.observe(element);
    });

    // --- 7. Animate Stats Counters ---
    function animateStats(parent) {
        const statNumbers = parent.querySelectorAll('.ach-number, .stat-number');
        statNumbers.forEach(stat => {
            const targetString = stat.getAttribute('data-target') || stat.textContent;
            
            // Extract suffix (any non-digit characters at the end)
            const suffixMatch = targetString.match(/[^\d.]+$/);
            const suffix = suffixMatch ? suffixMatch[0].trim() : '';
            
            // Check if it's a numeric target
            const targetNum = parseFloat(targetString);
            if (!isNaN(targetNum)) {
                let current = 0;
                const isFloat = targetString.includes('.');
                const decimals = isFloat ? targetString.split('.')[1].replace(/[^\d]/g, '').length : 0;
                
                const increment = isFloat ? targetNum / 50 : Math.ceil(targetNum / 50); // Speed control
                const duration = 1500; // Milliseconds
                const steps = isFloat ? 50 : (targetNum / increment);
                const stepTime = duration / steps;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= targetNum) {
                        stat.textContent = (isFloat ? targetNum.toFixed(decimals) : targetNum) + suffix;
                        clearInterval(timer);
                    } else {
                        stat.textContent = (isFloat ? current.toFixed(decimals) : Math.floor(current)) + suffix;
                    }
                }, stepTime);
            }
        });
    }

    // --- 9. Active Navigation Link Sync on Scroll ---
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
                moveIndicator(link);
            }
        });
    });



    // --- 11. Back to Top Button visibility ---
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.transform = 'translateY(0)';
                scrollTopBtn.style.pointerEvents = 'auto';
            } else {
                scrollTopBtn.style.opacity = '0';
                scrollTopBtn.style.transform = 'translateY(15px)';
                scrollTopBtn.style.pointerEvents = 'none';
            }
        });
        
        // Initial state
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.transform = 'translateY(15px)';
        scrollTopBtn.style.pointerEvents = 'none';
        scrollTopBtn.style.transition = 'all 0.3s ease';
    }
});
