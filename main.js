const { useState, useEffect } = React;
const { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } = window.Motion;

const App = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('Home');

    const toggleTheme = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark-mode');
    };

    const navLinks = [
        { name: 'Home', component: HeroSection, variant: 'fade' },
        { name: 'Experience', component: ExperienceSection, variant: 'slide' },
        { name: 'Skills', component: SkillsSection, variant: 'scale' },
        { name: 'Projects', component: ProjectsSection, variant: 'rotate' },
        { name: 'Articles', component: ArticlesSection, variant: 'slideUp' },
        { name: 'Hire Me', component: CTASection, variant: 'fade' },
        { name: 'Contact', component: ContactSection, variant: 'flip' },
    ];

    const variants = {
        fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
        slide: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '-100%' } },
        scale: { initial: { scale: 0 }, animate: { scale: 1 }, exit: { scale: 0 } },
        rotate: { initial: { rotateY: 90, opacity: 0 }, animate: { rotateY: 0, opacity: 1 }, exit: { rotateY: -90, opacity: 0 } },
        slideUp: { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '-100%' } },
        flip: { initial: { rotateX: 90, opacity: 0 }, animate: { rotateX: 0, opacity: 1 }, exit: { rotateX: -90, opacity: 0 } }
    };

    const handleNavClick = (name) => {
        setActiveSection(name);
        setMobileMenuOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const ActiveComponent = navLinks.find(link => link.name === activeSection).component;
    const activeVariant = variants[navLinks.find(link => link.name === activeSection).variant];

    return (
        <React.Fragment>
            <header>
                <nav>
                    <div className="logo">My Portfolio</div>
                    <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); handleNavClick(link.name); }}>
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <button id="theme-toggle" onClick={toggleTheme} aria-label="Toggle Dark Mode">
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                    <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        <i className="fas fa-bars"></i>
                    </div>
                </nav>
            </header>

            <main style={{ minHeight: '80vh', position: 'relative' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSection}
                        initial={activeVariant.initial}
                        animate={activeVariant.animate}
                        exit={activeVariant.exit}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <ActiveComponent />
                    </motion.div>
                </AnimatePresence>
            </main>

            <footer>
                <p>&copy; 2025 Sanuja Ramachandran</p>
                <p>Location: Batticaloa, Srilanka</p>
                <p>Contact no: +94768568550</p>
                <div className="social-links">
                    <a href="mailto:ramsanujah@email.com" aria-label="Email"><i className="fas fa-envelope"></i></a>
                    <a href="https://github.com/" target="_blank" aria-label="GitHub"><i className="fab fa-github"></i></a>
                    <a href="https://www.linkedin.com/" target="_blank" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
                </div>
            </footer>
        </React.Fragment>
    );
};

// --- Background Components ---

const ParticleBackground = () => {
    const canvasRef = React.useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;
                this.size = Math.random() * 3 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--secondary-color');
                ctx.globalAlpha = 0.5;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            const particleCount = window.innerWidth < 768 ? 25 : 50;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
                
                // Draw connections
                particles.forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--primary-color');
                        ctx.globalAlpha = 0.1; // Faint lines
                        ctx.lineWidth = 1;
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.stroke();
                    }
                });
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        initParticles();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="canvas-background" />;
};

const GradientBackground = () => {
    return (
        <div className="background-3d">
            <motion.div 
                className="shape" 
                style={{ width: 300, height: 300, top: '10%', left: '10%', background: 'var(--accent-color)' }}
                animate={{ x: [0, 50, 0], y: [0, 30, 0], rotate: [0, 90, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
                className="shape" 
                style={{ width: 250, height: 250, top: '60%', right: '10%', background: 'var(--secondary-color)' }}
                animate={{ x: [0, -40, 0], y: [0, -60, 0], rotate: [0, -90, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
                className="shape" 
                style={{ width: 200, height: 200, top: '40%', left: '40%', background: 'var(--primary-color)' }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    );
};

// --- Sections ---

const HeroSection = () => {
    return (
        <section id="about" className="page active">
            <ParticleBackground />
            <motion.img 
                src="c:\\Users\\ramsa\\OneDrive\\Pictures\\WhatsApp Image2 2025-05-20 at 22.43.19_13779ce1.jpg" 
                alt="Sanuja Ramachandran" 
                className="profile-img"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                whileHover={{ scale: 1.05, borderColor: "var(--secondary-color)" }}
            />
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                Sanuja Ramachandran
            </motion.h1>
            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                Biomedical Technology Student
            </motion.h2>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                This website will be used to showcase my projects, skills, and achievements
                in the field of Biomedical Technology and Healthcare Innovation.
            </motion.p>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                I am a passionate Biomedical Technology student with a keen interest in medical devices, bio-instrumentation, and healthcare IT. Currently, I am honing my skills in circuit design, biomaterials, and clinical engineering. My goal is to develop technologies that improve patient care and solve complex medical challenges.
            </motion.p>
            <motion.a 
                href="c:\\Users\\ramsa\\Downloads\\Sanuja-Ramachandran-FlowCV-Resume-20250520 (3).pdf" 
                className="btn" 
                download 
                style={{ marginTop: '2rem', display: 'inline-block' }}
                whileHover={{ scale: 1.05, y: -3, backgroundPosition: "right center" }}
                whileTap={{ scale: 0.95 }}
            >
                Download CV
            </motion.a>
            <div className="hero-icons">
                {[
                    { icon: "fa-heartbeat", color: "#e63946" },
                    { icon: "fa-microscope", color: "#457b9d" },
                    { icon: "fa-dna", color: "#2a9d8f" }
                ].map((item, index) => (
                    <motion.div
                        key={index}
                        style={{ display: 'inline-block', perspective: 1000 }}
                        animate={{ 
                            rotateY: [0, 360],
                            y: [0, -10, 0]
                        }}
                        transition={{ 
                            rotateY: { duration: 5, repeat: Infinity, ease: "linear", delay: index * 1 },
                            y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                    >
                        <i className={`fas ${item.icon}`} style={{ color: item.color, textShadow: "0 5px 15px rgba(0,0,0,0.2)" }}></i>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

const ExperienceSection = () => {
    const experiences = [
        { date: '2022 - Present', title: 'BHSc(Hons) in Biomedical Technology', company: 'Gampaha Wickramarachchi University of Indigenous Medicine', desc: 'Specializing in medical instrumentation, biomaterials, and clinical engineering. Dean\'s List 2026.' },
        { date: 'Summer 2025', title: 'Biomedical Engineering Intern', company: 'MedTech Solutions Inc.', desc: 'Assisted in the testing and calibration of patient monitoring devices. Conducted failure analysis on circuit boards.' },
        { date: '2025', title: 'Research Assistant', company: 'GWU Bio-Robotics Lab', desc: 'Contributed to the design of a soft-robotic actuator for rehabilitation gloves. Analyzed sensor data using MATLAB.' }
    ];

    return (
        <section id="experience" className="page">
            <GradientBackground />
            <h3>Education & Experience</h3>
            <div className="timeline">
                {experiences.map((exp, index) => (
                    <motion.div 
                        className="timeline-item" 
                        key={index}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                        <div className="timeline-dot"></div>
                        <motion.div 
                            className="timeline-content"
                            whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.15)" }}
                        >
                            <span className="timeline-date">{exp.date}</span>
                            <h4>{exp.title}</h4>
                            <p>{exp.company}</p>
                            <p>{exp.desc}</p>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

const SkillsSection = () => {
    const techSkills = [
        { name: 'Medical Instrumentation', width: '90%' },
        { name: 'Biomaterials', width: '85%' },
        { name: 'Clinical Engineering', width: '80%' }
    ];

    const softSkills = [
        { name: 'Teamwork', icon: 'fa-users', width: '95%' },
        { name: 'Problem Solving', icon: 'fa-lightbulb', width: '90%' },
        { name: 'Communication', icon: 'fa-comments', width: '95%' },
        { name: 'Time Management', icon: 'fa-clock', width: '85%' },
        { name: 'Project Management', icon: 'fa-project-diagram', width: '80%' },
        { name: 'Critical Thinking', icon: 'fa-brain', width: '90%' }
    ];

    const tools = [
        { name: 'AutoCAD 2D', icon: 'fa-drafting-compass' },
        { name: 'Solidworks', icon: 'fa-cube' },
        { name: 'VS Code', icon: 'fa-code' },
        { name: 'GitHub', icon: 'fa-github' },
        { name: 'Microsoft Office', icon: 'fa-microsoft' },
        { name: 'Adobe Photoshop', icon: 'fa-palette' },
        { name: 'MATLAB', icon: 'fa-calculator' }
    ];

    const SkillBar = ({ name, width, icon }) => (
        <div className="skill-bar">
            <div className="info">
                <p>{icon && <i className={`fas ${icon}`}></i>} {name}</p>
            </div>
            <div className="bar">
                <motion.span 
                    initial={{ width: 0 }}
                    whileInView={{ width: width }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                ></motion.span>
            </div>
        </div>
    );

    return (
        <section id="skills" className="page">
            <GradientBackground />
            <h3>Technical Skills</h3>
            <div className="skills-container">
                {techSkills.map((skill, i) => <SkillBar key={i} {...skill} />)}
            </div>
            
            <h3>Soft Skills</h3>
            <div className="skills-container">
                {softSkills.map((skill, i) => <SkillBar key={i} {...skill} />)}
            </div>

            <h3>Tools & Software</h3>
            <ul className="skills-list">
                {tools.map((tool, index) => (
                    <motion.li 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5, backgroundColor: "var(--primary-color)", color: "var(--text-light)" }}
                    >
                        <i className={`fas ${tool.icon}`}></i> {tool.name}
                    </motion.li>
                ))}
            </ul>
        </section>
    );
};

const ProjectCard = ({ project, index }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [15, -15]);
    const rotateY = useTransform(x, [-100, 100], [-15, 15]);

    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(event.clientX - centerX);
        y.set(event.clientY - centerY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div 
            className="project-card" 
            style={{ rotateX, rotateY, perspective: 1000 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <div style={{ transform: "translateZ(30px)", pointerEvents: "none" }}>
                <img src={project.img} alt={project.title} className="project-img" />
                <h4>{project.title}</h4>
                <p>{project.desc}</p>
            </div>
            <div style={{ transform: "translateZ(60px)" }}>
                <span className="github-link"><i className={`fas ${project.icon}`}></i> {project.linkText}</span>
            </div>
        </motion.div>
    );
};

const ProjectsSection = () => {
    const projects = [
        { title: 'Arduino Vital Sign Monitor', desc: 'Designed a portable patient monitoring system using Arduino to track heart rate and body temperature in real-time.', img: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', icon: 'fa-github', linkText: 'View Code' },
        { title: 'MRI Tumor Detection', desc: 'Developed a MATLAB algorithm using image segmentation and edge detection to identify brain tumors in MRI scans.', img: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', icon: 'fa-laptop-code', linkText: 'View Project' },
        { title: '3D Prosthetic Arm Design', desc: 'Created a fully articulated prosthetic arm model in SolidWorks, optimized for additive manufacturing.', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', icon: 'fa-cube', linkText: 'View Design' },
        { title: '3D Dental Implant Design', desc: 'Modeled a custom dental implant using CAD software, focusing on osseointegration surface textures and stress analysis.', img: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', icon: 'fa-tooth', linkText: 'View Model' },
        { title: 'Hospital Management System', desc: 'Built a web-based application using PHP and MySQL to manage patient records and appointment scheduling.', img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', icon: 'fa-database', linkText: 'View System' },
        { title: 'Personal Portfolio Website', desc: 'Designed and developed a responsive personal portfolio website to showcase biomedical projects and skills using HTML, CSS, and JavaScript.', img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', icon: 'fa-globe', linkText: 'View Website' }
    ];

    return (
        <section id="projects" className="page">
            <h3>Projects & Coding Portfolio</h3>
            <div className="projects-grid">
                {projects.map((project, index) => (
                    <ProjectCard key={index} project={project} index={index} />
                ))}
            </div>
        </section>
    );
};

const ArticlesSection = () => {
    return (
        <section id="articles" className="page">
            <h3>Featured Articles</h3>
            <motion.div 
                className="project-card"
                whileHover={{ y: -10 }}
            >
                <h4>Innovations in Prosthetics</h4>
                <p>Exploring the latest advancements in bionic limbs and neural interfaces.</p>
                <span className="github-link">Read Article</span>
            </motion.div>
            <motion.div 
                className="project-card"
                whileHover={{ y: -10 }}
            >
                <h4>AI in Medical Imaging</h4>
                <p>How machine learning is revolutionizing diagnostic accuracy in radiology.</p>
                <span className="github-link">Read Article</span>
            </motion.div>
        </section>
    );
};

const CTASection = () => {
    return (
        <section id="cta" className="page">
            <h2>Ready to collaborate?</h2>
            <p>I am available for internships, research projects, and new opportunities.</p>
            <div className="cta-buttons">
                <motion.a href="#contact" className="btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Hire Me</motion.a>
                <motion.a href="c:\\Users\\ramsa\\Downloads\\Sanuja-Ramachandran-FlowCV-Resume-20250520 (3).pdf" className="btn" download whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Download Resume</motion.a>
            </div>
        </section>
    );
};

const ContactSection = () => {
    return (
        <section id="contact" className="page">
            <h3>Contact</h3>
            <div className="social-links">
                <a href="mailto:ramsanujah@email.com" aria-label="Email"><i className="fas fa-envelope"></i></a>
                <a href="https://github.com/" target="_blank" aria-label="GitHub"><i className="fab fa-github"></i></a>
                <a href="https://www.linkedin.com/" target="_blank" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
            </div>
            <form id="contact-form" className="contact-form">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="Your Email" required />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea id="message" name="message" rows="5" placeholder="Your Message" required></textarea>
                </div>
                <motion.button type="submit" className="btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Send Message</motion.button>
            </form>
        </section>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);