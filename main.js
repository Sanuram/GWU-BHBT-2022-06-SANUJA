/**
 * Main Application Script
 * Handles Theme, Navigation, Forms, and Mobile Menu
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Main JS loaded and DOM ready!");
    initTheme();
    initNavigation();
    initContactForm();
    initProjects();
    initMobileMenu();
    init3DBackgroundInteraction();
    initTypingEffect();
});

/**
 * Initialize Theme Toggling (Dark/Light Mode)
 */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (!themeToggle) return;

    // Check local storage for saved theme
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

/**
 * Initialize Single Page Application Navigation & Transitions
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('nav a, .cta-buttons a');

    // Define animation styles for each page
    const pageAnimations = {
        'about': 'fade',
        'skills': 'slide',
        'projects': 'zoom',
        'articles': 'rotate',
        'cta': 'pop',
        'contact': 'slide'
    };

    function navigateTo(targetId) {
        const targetPage = document.getElementById(targetId);
        const currentPage = document.querySelector('.page.active');

        if (!targetPage || targetPage === currentPage) return;

        const animationType = pageAnimations[targetId] || 'fade';

        // Animate Out Current Page
        if (currentPage) {
            currentPage.classList.add(`${animationType}-out`);
            currentPage.classList.remove('active');
            
            // Clean up classes after animation
            setTimeout(() => {
                currentPage.classList.remove(`${animationType}-out`);
            }, 600);
        }

        // Animate In New Page
        targetPage.classList.add('active');
        targetPage.classList.add(`${animationType}-in`);

        // Clean up classes after animation
        setTimeout(() => {
            targetPage.classList.remove(`${animationType}-in`);
        }, 600);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // Only intercept internal links starting with #
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                navigateTo(targetId);
                
                // Close mobile menu
                const navLinksContainer = document.querySelector('.nav-links');
                if (navLinksContainer && navLinksContainer.classList.contains('active')) {
                    navLinksContainer.classList.remove('active');
                }
            }
        });
    });
}

/**
 * Initialize 3D Background Interaction
 */
function init3DBackgroundInteraction() {
    const aboutSection = document.getElementById('about');
    const backgroundContainer = document.querySelector('.background-3d');

    if (!aboutSection || !backgroundContainer) return;

    aboutSection.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        // Calculate rotation (-10 to 10 degrees)
        const rotateY = (x - 0.5) * 20;
        const rotateX = (0.5 - y) * 20;

        backgroundContainer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
}

/**
 * Initialize Typing Effect
 */
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const text = typingElement.getAttribute('data-text');
    let index = 0;
    typingElement.textContent = "";

    function type() {
        if (index < text.length) {
            typingElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100); // Typing speed
        }
    }

    // Start typing after a delay (e.g., after fade-in animations)
    setTimeout(type, 1000);
}

/**
 * Initialize Contact Form Handling
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Capture User Input
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        console.log("User Input Captured:", formData);

        // Simulate form submission
        const btn = contactForm.querySelector('button');
        const originalText = btn.textContent;
        
        btn.textContent = 'Sending...';
        btn.disabled = true;

        setTimeout(() => {
            alert(`Thank you, ${formData.name}! Message sent successfully.`);
            contactForm.reset();
            btn.textContent = originalText;
            btn.disabled = false;
        }, 1500);
    });
}

/**
 * Initialize Mobile Hamburger Menu
 */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
        });
    }
}

/**
 * Initialize Dynamic Projects Section
 */
function initProjects() {
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;

    // Create Filter Container if it doesn't exist
    let filterContainer = document.getElementById('project-filters');
    if (!filterContainer) {
        filterContainer = document.createElement('div');
        filterContainer.id = 'project-filters';
        filterContainer.className = 'filter-buttons';
        projectsContainer.parentNode.insertBefore(filterContainer, projectsContainer);
    }

    const projects = [
        {
            title: "Personal Portfolio",
            category: "Web",
            description: "A responsive website to showcase my skills and projects.",
            link: "https://github.com/",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
        },
        {
            title: "To-Do List App",
            category: "App",
            description: "A JavaScript application to manage daily tasks efficiently.",
            link: "https://github.com/",
            image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=600&q=80"
        },
        {
            title: "Weather Dashboard",
            category: "API",
            description: "Real-time weather tracking using OpenWeather API.",
            link: "https://github.com/",
            image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=600&q=80"
        },
        {
            title: "E-commerce Store",
            category: "Web",
            description: "Full-stack online shop with cart and payment integration.",
            link: "https://github.com/",
            image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=600&q=80"
        },
        {
            title: "Task Manager API",
            category: "API",
            description: "RESTful API for managing tasks, built with Node.js and Express.",
            link: "https://github.com/",
            image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=600&q=80"
        },
        {
            title: "Real-time Chat App",
            category: "App",
            description: "Instant messaging application using Socket.io.",
            link: "https://github.com/",
            image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80"
        }
    ];

    // Get unique categories
    const categories = ['All', ...new Set(projects.map(p => p.category))];

    // Render Filter Buttons
    filterContainer.innerHTML = categories.map(cat => 
        `<button class="filter-btn ${cat === 'All' ? 'active' : ''}" data-filter="${cat}">${cat}</button>`
    ).join('');

    // Function to render projects
    const renderProjects = (category) => {
        projectsContainer.innerHTML = ''; // Clear current
        
        const filteredProjects = category === 'All' 
            ? projects 
            : projects.filter(p => p.category === category);

        filteredProjects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            // Add fade-in animation
            card.style.animation = 'fadeInUp 0.5s ease forwards';            
            card.innerHTML = `
                <div class="project-img-wrapper">
                    <img src="${project.image}" alt="${project.title}">
                </div>
                <span class="category-tag">${project.category}</span>
                <h4>${project.title}</h4>
                <p>${project.description}</p>
                <span class="github-link" onclick="window.open('${project.link}', '_blank')">GitHub Link</span>
            `;
            projectsContainer.appendChild(card);
        });
    };

    // Initial render
    renderProjects('All');

    // Add click listeners to buttons
    filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all
            filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            e.target.classList.add('active');
            // Render
            renderProjects(e.target.getAttribute('data-filter'));
        });
    });
}