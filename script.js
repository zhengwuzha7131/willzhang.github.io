"use strict";

// ===== Mobile Navigation Toggle =====
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ===== Typewriter Effect =====
const phrases = [
    'Software Engineer',
    'Data Science Student',
    'Problem Solver',
    'Full-Stack Developer',
    'ML Enthusiast'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.querySelector('.typing-text');
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseTime = 2000;

function type() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(type, pauseTime);
        return;
    }
    
    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
    }
    
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    setTimeout(type, speed);
}

// Start typing effect when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 500);
});

// ===== Smooth Scroll with Offset =====
const scrollWithOffset = (event) => {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
        const offsetPosition = targetElement.offsetTop - 80;
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
};

navLinks.forEach(link => {
    link.addEventListener('click', scrollWithOffset);
});

// Also handle hero button clicks
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', scrollWithOffset);
});

// ===== Active Navigation Link on Scroll =====
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== Scroll Reveal Animation =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add staggered delay for timeline items
            if (entry.target.classList.contains('timeline-item')) {
                entry.target.style.animationDelay = `${index * 0.1}s`;
            }
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe timeline items
document.querySelectorAll('.timeline-item').forEach(item => {
    observer.observe(item);
});

// ===== Projects Carousel =====
class ProjectCarousel {
    constructor() {
        this.track = document.querySelector('.carousel-track');
        this.slides = Array.from(document.querySelectorAll('.project-slide'));
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dotsContainer = document.getElementById('carouselDots');
        
        if (!this.track || !this.slides.length) return;
        
        this.currentIndex = 0;
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        // Create dots
        this.createDots();
        
        // Event listeners
        this.prevBtn?.addEventListener('click', () => this.prev());
        this.nextBtn?.addEventListener('click', () => this.next());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
        
        // Touch/drag support
        this.addDragSupport();
        
        // Auto-play (optional)
        // this.startAutoPlay();
        
        // Update buttons
        this.updateButtons();
    }
    
    createDots() {
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer?.appendChild(dot);
        });
        this.dots = Array.from(document.querySelectorAll('.carousel-dot'));
    }
    
    updateDots() {
        this.dots?.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    updateButtons() {
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex === this.slides.length - 1;
        }
    }
    
    goToSlide(index) {
        if (this.isTransitioning || index === this.currentIndex) return;
        if (index < 0 || index >= this.slides.length) return;
        
        this.isTransitioning = true;
        this.currentIndex = index;
        
        // Calculate offset - each slide is 100% of container width
        const offset = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${offset}%)`;
        
        this.updateDots();
        this.updateButtons();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }
    
    next() {
        if (this.currentIndex < this.slides.length - 1) {
            this.goToSlide(this.currentIndex + 1);
        }
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.goToSlide(this.currentIndex - 1);
        }
    }
    
    addDragSupport() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let startOffset = 0;
        
        const handleStart = (e) => {
            if (this.isTransitioning) return;
            isDragging = true;
            startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
            startOffset = -this.currentIndex * 100;
            this.track.style.transition = 'none';
            this.track.style.cursor = 'grabbing';
        };
        
        const handleMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
            
            // Calculate drag distance as percentage of container width
            const container = this.track.parentElement;
            const containerWidth = container.offsetWidth;
            const diff = currentX - startX;
            const diffPercent = (diff / containerWidth) * 100;
            
            // Apply drag with resistance at edges
            let newOffset = startOffset + diffPercent;
            
            // Add resistance at boundaries
            if (this.currentIndex === 0 && diffPercent > 0) {
                newOffset = startOffset + (diffPercent * 0.3);
            } else if (this.currentIndex === this.slides.length - 1 && diffPercent < 0) {
                newOffset = startOffset + (diffPercent * 0.3);
            }
            
            this.track.style.transform = `translateX(${newOffset}%)`;
        };
        
        const handleEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            this.track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            this.track.style.cursor = 'grab';
            
            const diff = startX - currentX;
            const threshold = 50;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0 && this.currentIndex < this.slides.length - 1) {
                    this.next();
                } else if (diff < 0 && this.currentIndex > 0) {
                    this.prev();
                } else {
                    // Snap back to current position
                    this.goToSlide(this.currentIndex);
                }
            } else {
                // Snap back if drag wasn't far enough
                this.goToSlide(this.currentIndex);
            }
        };
        
        this.track.addEventListener('mousedown', handleStart);
        this.track.addEventListener('mousemove', handleMove);
        this.track.addEventListener('mouseup', handleEnd);
        this.track.addEventListener('mouseleave', handleEnd);
        
        this.track.addEventListener('touchstart', handleStart, { passive: false });
        this.track.addEventListener('touchmove', handleMove, { passive: false });
        this.track.addEventListener('touchend', handleEnd);
        
        // Prevent image dragging and text selection
        this.slides.forEach(slide => {
            const img = slide.querySelector('img');
            if (img) {
                img.addEventListener('dragstart', (e) => e.preventDefault());
            }
        });
        
        this.track.style.cursor = 'grab';
    }
    
    startAutoPlay(interval = 5000) {
        this.autoPlayInterval = setInterval(() => {
            if (this.currentIndex === this.slides.length - 1) {
                this.goToSlide(0);
            } else {
                this.next();
            }
        }, interval);
        
        // Pause on hover
        this.track.addEventListener('mouseenter', () => {
            clearInterval(this.autoPlayInterval);
        });
        
        this.track.addEventListener('mouseleave', () => {
            this.startAutoPlay(interval);
        });
    }
}

// Initialize carousel
const projectCarousel = new ProjectCarousel();

// ===== Navbar Background on Scroll =====
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(10, 10, 10, 0.98)';
        nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
    } else {
        nav.style.background = 'rgba(10, 10, 10, 0.95)';
        nav.style.boxShadow = 'none';
    }
});

// ===== Parallax Effect for Hero =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - (scrolled / 700);
    }
});

// ===== Smooth Scroll Indicator =====
const scrollIndicator = document.querySelector('.scroll-indicator');

if (scrollIndicator) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    });
}

// ===== Stats Counter Animation =====
const animateCounter = (element, target, duration = 2000) => {
    let current = 0;
    const increment = target / (duration / 16);
    const isDecimal = target.toString().includes('+');
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current) + (isDecimal ? '+' : '');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (isDecimal ? '+' : '');
        }
    };
    
    updateCounter();
};

// Observe stat cards for counter animation
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            const targetValue = parseInt(statNumber.textContent);
            const hasPlus = statNumber.textContent.includes('+');
            
            animateCounter(statNumber, targetValue, 2000);
            
            if (hasPlus) {
                statNumber.textContent += '+';
            }
            
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
    statObserver.observe(card);
});

// ===== Form Submission Handling =====
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Reset button after form submission
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// ===== Cursor Effect (Optional - for desktop) =====
const createCursorEffect = () => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-dot';
    cursor.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: var(--primary-color);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.2s ease;
        display: none;
    `;
    document.body.appendChild(cursor);
    
    // Only show on desktop
    if (window.innerWidth > 968) {
        cursor.style.display = 'block';
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // Enlarge cursor on hover over interactive elements
        document.querySelectorAll('a, button, .project-card').forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(3)';
                cursor.style.opacity = '0.5';
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.opacity = '1';
            });
        });
    }
};

// Initialize cursor effect
createCursorEffect();

// ===== Add loading animation =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===== Easter Egg: Konami Code =====
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        document.body.style.transform = 'rotate(360deg)';
        document.body.style.transition = 'transform 1s ease';
        
        setTimeout(() => {
            document.body.style.transform = 'rotate(0deg)';
        }, 1000);
        
        // Show a fun message
        const message = document.createElement('div');
        message.textContent = '🎮 You found the secret! 🎮';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--accent-gradient);
            color: var(--dark-bg);
            padding: 2rem 4rem;
            border-radius: 12px;
            font-size: 2rem;
            font-weight: 700;
            z-index: 10000;
            animation: fadeInOut 3s ease;
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
        
        konamiCode = [];
    }
});

// Add fade animation for the message
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
`;
document.head.appendChild(style);

