// ============================================
// 3D PARTICLE BACKGROUND ANIMATION
// ============================================
class ParticleBackground {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
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
        
        // Add glow
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
        
        // Mouse interaction
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            particle.x -= dx * 0.01;
            particle.y -= dy * 0.01;
        }
        
        // Reset particle
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

// Initialize
const particleBg = new ParticleBackground();

// ============================================
// DARK MODE TOGGLE
// ============================================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved theme or default to light
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

// Toggle theme on click
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const theme = html.getAttribute('data-theme');
        const newTheme = theme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// ============================================
// NAVBAR SCROLL
// ============================================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

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
            
            // Skill bars animation
            if (entry.target.classList.contains('skill-category')) {
                animateSkillBars(entry.target);
            }
            
            // Counter animation
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
document.querySelectorAll('.section, .skill-category, .timeline-item, .stat-card').forEach(el => {
    observer.observe(el);
});

// ============================================
// SKILL BARS ANIMATION
// ============================================
function animateSkillBars(skillCategory) {
    const progressBars = skillCategory.querySelectorAll('.skill-progress');
    
    progressBars.forEach((bar, index) => {
        const targetWidth = bar.getAttribute('data-progress');
        setTimeout(() => {
            bar.style.width = targetWidth + '%';
        }, index * 100);
    });
}

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
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name') || document.querySelector('.contact-form input[type="text"]').value;
        const email = formData.get('email') || document.querySelector('.contact-form input[type="email"]').value;
        const subject = formData.get('subject') || document.querySelectorAll('.contact-form input[type="text"]')[1]?.value;
        const message = formData.get('message') || document.querySelector('.contact-form textarea').value;
        
        // Show success message
        alert(`Thank you for your message!\n\nCurrently, this form stores data locally. To receive emails:\n\n1. Use FormSubmit.co (free)\n2. Use EmailJS (free)\n3. Set up your own backend\n\nYour message:\nName: ${name}\nEmail: ${email}\nSubject: ${subject}`);
        
        // Log to console for now (you can see it in browser dev tools)
        console.log('Form Submission:', {
            name: name,
            email: email,
            subject: subject,
            message: message,
            timestamp: new Date().toISOString()
        });
        
        // Reset form
        contactForm.reset();
        
        /* 
        TO RECEIVE EMAILS - Choose one option:
        
        OPTION 1: FormSubmit.co (EASIEST - No signup needed!)
        - Change form action to: action="https://formsubmit.co/kshitizbhatt433@gmail.com"
        - Add method="POST" to form tag
        - Remove the e.preventDefault() line above
        - That's it! You'll receive emails directly
        
        OPTION 2: EmailJS (Free, more control)
        - Sign up at emailjs.com
        - Get your public key
        - Use their JavaScript SDK
        
        OPTION 3: Your own backend
        - Create an API endpoint (Node.js/Python/PHP)
        - Send form data there
        - Backend sends you email
        */
    });
}