import React, { useState, useEffect } from "react";
import { Link } from "gatsby";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faGraduationCap, 
  faBriefcase, 
  faAward,
  faLightbulb,
  faHeart,
  faDownload,
  faMapMarkerAlt,
  faCalendarAlt,
  faEnvelope
} from "@fortawesome/free-solid-svg-icons";
import { 
  faLinkedin, 
  faBehance, 
  faDribbble,
  faFigma,
  faAdobe
} from "@fortawesome/free-brands-svg-icons";
import Header from "../components/Header";
import Footer from "../components/Footer";
import myImage from "../profileimage/my_image.jpg";
import "../styles/gallery.css";
import "../styles/about.css";

const About = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const skills = [
    { name: "UI/UX Design", level: 95 },
    { name: "Graphic Design", level: 90 },
    { name: "Brand Identity", level: 85 },
    { name: "Web Design", level: 88 },
    { name: "Mobile Design", level: 82 },
    { name: "Illustration", level: 78 }
  ];

  const tools = [
    { name: "Figma", icon: faFigma, proficiency: "Expert" },
    { name: "Adobe XD", icon: faAdobe, proficiency: "Expert" },
    { name: "Photoshop", icon: faAdobe, proficiency: "Advanced" },
    { name: "Illustrator", icon: faAdobe, proficiency: "Advanced" },
    { name: "After Effects", icon: faAdobe, proficiency: "Intermediate" }
  ];

  const experiences = [
    {
      year: "2023 - Present",
      role: "Senior UI/UX Designer",
      company: "Freelance",
      description: "Leading design projects for international clients, creating comprehensive design systems and user experiences."
    },
    {
      year: "2021 - 2023",
      role: "UI/UX Designer",
      company: "Digital Agency",
      description: "Designed user interfaces for web and mobile applications, collaborated with development teams."
    },
    {
      year: "2020 - 2021",
      role: "Graphic Designer",
      company: "Creative Studio",
      description: "Created brand identities, marketing materials, and digital assets for various clients."
    }
  ];

  const achievements = [
    {
      icon: faAward,
      title: "Top Rated Freelancer",
      description: "Achieved top-rated status on Upwork with 100% job success score"
    },
    {
      icon: faBriefcase,
      title: "500+ Projects",
      description: "Successfully completed over 500 design projects across different industries"
    },
    {
      icon: faHeart,
      title: "Client Satisfaction",
      description: "Maintained 98% client satisfaction rate with excellent feedback"
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Me - Mubashir UI Hassan | UI/UX Designer</title>
        <meta name="description" content="Learn about Mubashir UI Hassan, a passionate UI/UX designer with 5+ years of experience creating beautiful and functional digital experiences." />
        <meta name="keywords" content="about, UI designer, UX designer, portfolio, experience, skills, Mubashir Hassan" />
      </Helmet>

      <div className={`about-page ${isLoaded ? 'loaded' : ''}`}>
        <Header />

        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-content">
            <div className="hero-text">
              <h1 className="about-title">
                <span className="title-highlight">About</span> Me
              </h1>
              <p className="about-subtitle">
                Passionate UI/UX Designer crafting digital experiences that matter
              </p>
              
              <div className="hero-stats">
                <div className="stat-item">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>5+ Years Experience</span>
                </div>
                <div className="stat-item">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <span>Pakistan</span>
                </div>
                <div className="stat-item">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <span>Available for Work</span>
                </div>
              </div>
            </div>

            <div className="hero-image">
              <div className="image-container">
                <img src={myImage} alt="Mubashir UI Hassan" />
                <div className="image-overlay">
                  <div className="social-links">
                    <a href="#" className="social-link">
                      <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                    <a href="#" className="social-link">
                      <FontAwesomeIcon icon={faBehance} />
                    </a>
                    <a href="#" className="social-link">
                      <FontAwesomeIcon icon={faDribbble} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="about-navigation">
          <div className="nav-container">
            <button 
              className={`nav-tab ${activeSection === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveSection('overview')}
            >
              <FontAwesomeIcon icon={faUser} />
              Overview
            </button>
            <button 
              className={`nav-tab ${activeSection === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveSection('skills')}
            >
              <FontAwesomeIcon icon={faLightbulb} />
              Skills
            </button>
            <button 
              className={`nav-tab ${activeSection === 'experience' ? 'active' : ''}`}
              onClick={() => setActiveSection('experience')}
            >
              <FontAwesomeIcon icon={faBriefcase} />
              Experience
            </button>
            <button 
              className={`nav-tab ${activeSection === 'achievements' ? 'active' : ''}`}
              onClick={() => setActiveSection('achievements')}
            >
              <FontAwesomeIcon icon={faAward} />
              Achievements
            </button>
          </div>
        </section>

        {/* Content Sections */}
        <section className="about-content">
          <div className="content-container">
            
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="content-section overview-section">
                <div className="section-grid">
                  <div className="section-text">
                    <h2>Hello, I'm Mubashir UI Hassan</h2>
                    <p className="lead-text">
                      A passionate UI/UX Designer with over 5 years of experience creating beautiful, 
                      functional, and user-centered digital experiences.
                    </p>
                    <p>
                      I specialize in transforming complex problems into simple, elegant design solutions. 
                      My approach combines strategic thinking with creative execution to deliver designs 
                      that not only look great but also provide exceptional user experiences.
                    </p>
                    <p>
                      From initial concept to final implementation, I work closely with clients and teams 
                      to ensure every pixel serves a purpose. My expertise spans across web design, 
                      mobile applications, brand identity, and digital marketing materials.
                    </p>

                    <div className="personal-info">
                      <h3>Personal Information</h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <strong>Location:</strong> Pakistan
                        </div>
                        <div className="info-item">
                          <strong>Experience:</strong> 5+ Years
                        </div>
                        <div className="info-item">
                          <strong>Projects:</strong> 500+ Completed
                        </div>
                        <div className="info-item">
                          <strong>Availability:</strong> Open for Work
                        </div>
                      </div>
                    </div>

                    <div className="cta-buttons">
                      <button className="btn-primary">
                        <FontAwesomeIcon icon={faDownload} />
                        Download CV
                      </button>
                      <Link to="/contact" className="btn-secondary">
                        Get In Touch
                      </Link>
                    </div>
                  </div>

                  <div className="section-visual">
                    <div className="philosophy-card">
                      <h3>My Design Philosophy</h3>
                      <div className="philosophy-items">
                        <div className="philosophy-item">
                          <div className="philosophy-icon">🎯</div>
                          <h4>User-Centered</h4>
                          <p>Every design decision is made with the user in mind</p>
                        </div>
                        <div className="philosophy-item">
                          <div className="philosophy-icon">✨</div>
                          <h4>Simple & Clean</h4>
                          <p>Complexity is the enemy of usability</p>
                        </div>
                        <div className="philosophy-item">
                          <div className="philosophy-icon">🚀</div>
                          <h4>Innovation</h4>
                          <p>Always pushing boundaries while maintaining functionality</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Skills Section */}
            {activeSection === 'skills' && (
              <div className="content-section skills-section">
                <h2>Skills & Expertise</h2>
                
                <div className="skills-grid">
                  <div className="skills-column">
                    <h3>Design Skills</h3>
                    <div className="skill-bars">
                      {skills.map((skill, index) => (
                        <div key={index} className="skill-item">
                          <div className="skill-header">
                            <span className="skill-name">{skill.name}</span>
                            <span className="skill-percentage">{skill.level}%</span>
                          </div>
                          <div className="skill-bar">
                            <div 
                              className="skill-progress"
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="tools-column">
                    <h3>Tools & Software</h3>
                    <div className="tools-grid">
                      {tools.map((tool, index) => (
                        <div key={index} className="tool-item">
                          <div className="tool-icon">
                            <FontAwesomeIcon icon={tool.icon} />
                          </div>
                          <div className="tool-info">
                            <h4>{tool.name}</h4>
                            <span className="proficiency">{tool.proficiency}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Experience Section */}
            {activeSection === 'experience' && (
              <div className="content-section experience-section">
                <h2>Professional Experience</h2>
                
                <div className="timeline">
                  {experiences.map((exp, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <h3>{exp.role}</h3>
                          <span className="company">{exp.company}</span>
                          <span className="year">{exp.year}</span>
                        </div>
                        <p>{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="education-section">
                  <h3>Education</h3>
                  <div className="education-item">
                    <FontAwesomeIcon icon={faGraduationCap} />
                    <div className="education-info">
                      <h4>Bachelor's in Graphic Design</h4>
                      <p>University of Arts • 2016-2020</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Achievements Section */}
            {activeSection === 'achievements' && (
              <div className="content-section achievements-section">
                <h2>Achievements & Recognition</h2>
                
                <div className="achievements-grid">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="achievement-card">
                      <div className="achievement-icon">
                        <FontAwesomeIcon icon={achievement.icon} />
                      </div>
                      <h3>{achievement.title}</h3>
                      <p>{achievement.description}</p>
                    </div>
                  ))}
                </div>

                <div className="testimonials-section">
                  <h3>What Clients Say</h3>
                  <div className="testimonial-item">
                    <blockquote>
                      "Mubashir delivered exceptional design work that exceeded our expectations. 
                      His attention to detail and creative approach made our project a huge success."
                    </blockquote>
                    <cite>- Sarah Johnson, CEO at TechStart</cite>
                  </div>
                </div>
              </div>
            )}

          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default About;
