// ============================================
// 3D PARTICLE BACKGROUND ANIMATION
// ============================================
class ParticleBackground {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.mouse = { x: 0, y: 0 };
        
        this.init();
        this.addEventListeners();
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                z: Math.random() * 1000,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                vz: Math.random() * 2,
                size: Math.random() * 2 + 1
            });
        }
    }
    
    drawParticle(particle) {
        const scale = 1000 / (1000 + particle.z);
        const x = (particle.x - this.canvas.width / 2) * scale + this.canvas.width / 2;
        const y = (particle.y - this.canvas.height / 2) * scale + this.canvas.height / 2;
        const size = particle.size * scale;
        
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const opacity = (1000 - particle.z) / 1000;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fillStyle = isDark 
            ? `rgba(99, 102, 241, ${opacity * 0.6})` 
            : `rgba(99, 102, 241, ${opacity * 0.4})`;
        this.ctx.fill();
        
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size * 3);
        gradient.addColorStop(0, `rgba(99, 102, 241, ${opacity * 0.2})`);
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x - size * 3, y - size * 3, size * 6, size * 6);
    }
    
    updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z -= particle.vz;
        
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            particle.x -= dx * 0.01;
            particle.y -= dy * 0.01;
        }
        
        if (particle.z < 0) {
            particle.z = 1000;
            particle.x = Math.random() * this.canvas.width;
            particle.y = Math.random() * this.canvas.height;
        }
        
        if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                    const opacity = (120 - distance) / 120 * 0.15;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = isDark 
                        ? `rgba(99, 102, 241, ${opacity})` 
                        : `rgba(99, 102, 241, ${opacity * 0.6})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });
        
        this.drawConnections();
        
        requestAnimationFrame(() => this.animate());
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
}

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particle background
    const particleBg = new ParticleBackground();

    // ============================================
    // PDF DOWNLOAD FUNCTIONALITY
    // ============================================
    // Download button now links directly to Kshitiz_Bhatt_CV.pdf
    // No JavaScript needed - HTML handles it with download attribute

    // ============================================
    // DARK MODE TOGGLE - FIXED VERSION
    // ============================================
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    // Load saved theme or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', currentTheme);

    // Add click event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const theme = htmlElement.getAttribute('data-theme');
            const newTheme = theme === 'light' ? 'dark' : 'light';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            console.log('Theme switched to:', newTheme);
        });
        
        console.log('Dark mode toggle initialized successfully');
    } else {
        console.error('Theme toggle button not found! Make sure your HTML has an element with id="themeToggle"');
    }

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // ============================================
    // SMOOTH SCROLLING
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ============================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ============================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Counter animation for stats
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    if (!stat.classList.contains('counted')) {
                        stat.classList.add('counted');
                        animateCounter(stat);
                    }
                });
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.section, .skill-group, .timeline-item, .stat-card').forEach(el => {
        observer.observe(el);
    });

    // ============================================
    // COUNTER ANIMATION
    // ============================================
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        updateCounter();
    }

    // ============================================
    // CONTACT FORM
    // ============================================
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // FormSubmit will handle the submission
            // The form will redirect after submission
            console.log('Form submitted');
        });
    }

    console.log('All JavaScript initialized successfully!');
});