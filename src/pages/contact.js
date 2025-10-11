import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faClock,
  faPaperPlane,
  faCheckCircle,
  faExclamationTriangle,
  faUser,
  faBuilding,
  faComment
} from "@fortawesome/free-solid-svg-icons";
import { 
  faLinkedin, 
  faWhatsapp, 
  faSkype,
  faUpwork,
  faTelegram
} from "@fortawesome/free-brands-svg-icons";
import emailjs from 'emailjs-com';
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/gallery.css";
import "../styles/contact.css";
import { text } from "@fortawesome/fontawesome-svg-core";

const Contact = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    budget: '',
    message: '',
    timeline: ''
  });
  const [formStatus, setFormStatus] = useState({
    type: '', // success, error, loading
    message: ''
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ type: 'loading', message: 'Sending your message...' });

    // EmailJS integration
    emailjs.send(
      'service_y041xrn', // <-- Your EmailJS service ID
      'template_2ttp05g', // <-- Your EmailJS template ID
      {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        service: formData.service,
        budget: formData.budget,
        timeline: formData.timeline,
        company: formData.company
      },
      '7dM7bmpy9TBybmc-D' // <-- Your EmailJS public key
    ).then(
      (result) => {
        setFormStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully. I\'ll get back to you within 24 hours.' });
        setFormData({
          name: '',
          email: '',
          company: '',
          service: '',
          budget: '',
          message: '',
          timeline: ''
        });
      },
      (error) => {
        setFormStatus({ type: 'error', message: 'Failed to send message. Please try again later.' });
      }
    );
  };

  const contactMethods = [
    {
      icon: faEnvelope,
      title: "Email",
      value: "mubashirulhassan114@gmail.com",
      description: "Best for detailed project discussions"
    },
    {
      icon: faWhatsapp,
      title: "WhatsApp",
      value: "+92 315 1720203",
      description: "Quick questions and instant communication"
    },
    {
      icon: faLinkedin,
      title: "LinkedIn",
      value: "https://www.linkedin.com/in/mubashir1145/",
      description: "Professional networking and connections"
    },
    {
      icon: faUpwork,
      title: "Upwork",
      value: "Top Rated Freelancer",
      description: "Secure project management and payments"
    }
  ];

  const availability = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 2:00 PM" },
    { day: "Sunday", hours: "Emergency Only" }
  ];

  const services = [
    "UI/UX Design",
    "Mobile App Design", 
    "Web Design",
    "Brand Identity",
    "Digital Marketing",
    "Graphic Design",
    "Other"
  ];

  const budgetRanges = [
    "Under $500",
    "$500 - $1,000",
    "$1,000 - $2,500",
    "$2,500 - $5,000",
    "$5,000 - $10,000",
    "Above $10,000"
  ];

  const timelines = [
    "ASAP (Rush Job)",
    "Within 1 Week",
    "Within 2 Weeks", 
    "Within 1 Month",
    "More than 1 Month",
    "Flexible"
  ];

  return (
    <>
      <Helmet>
        <title>Contact Me - Let's Work Together | Mubashir UI Hassan</title>
        <meta name="description" content="Get in touch with Mubashir UI Hassan for your next UI/UX design project. Available for freelance work worldwide." />
        <meta name="keywords" content="contact, hire UI designer, freelance designer, UI/UX services, design consultation" />
      </Helmet>

      <div className={`contact-page ${isLoaded ? 'loaded' : ''}`}>
        <Header />

        {/* Hero Section */}
        <section className="contact-hero">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="contact-title">
                Let's Create Something 
                <span className="title-highlight"> Amazing</span> Together
              </h1>
              <p className="contact-subtitle">
                Ready to bring your vision to life? I'm here to help you create 
                exceptional digital experiences that your users will love.
              </p>
              
              <div className="hero-stats">
                <div className="stat-item">
                  <FontAwesomeIcon icon={faClock} />
                  <div>
                    <strong style={{ color: '#000000ff' }}>24 Hour</strong>
                    <span>Response Time</span>
                  </div>
                </div>
                <div className="stat-item">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <div>
                    <strong style={{ color: '#000000ff' }}>500+</strong>
                    <span>Projects Delivered</span>
                  </div>
                </div>
                <div className="stat-item">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <div>
                    <strong style={{ color: '#000000ff' }}>Worldwide</strong>
                    <span>Availability</span>
                  </div>
                </div>
                
              </div>
            </div>

            <div className="hero-visual">
              <div className="contact-visual">
                <div className="floating-icons">
                  <div className="icon-item">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                  <div className="icon-item">
                    <FontAwesomeIcon icon={faWhatsapp} />
                  </div>
                  <div className="icon-item">
                    <FontAwesomeIcon icon={faLinkedin} />
                  </div>
                  <div className="icon-item">
                    <FontAwesomeIcon icon={faPhone} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="contact-content">
          <div className="container">
            <div className="contact-grid">
              
              {/* Contact Form */}
              <div className="contact-form-section">
                <div className="form-header">
                  <h2>Start Your Project</h2>
                  <p>Tell me about your project and I'll get back to you within 24 hours</p>
                </div>

                {formStatus.message && (
                  <div className={`form-status ${formStatus.type}`}>
                    <FontAwesomeIcon 
                      icon={
                        formStatus.type === 'success' ? faCheckCircle : 
                        formStatus.type === 'error' ? faExclamationTriangle : 
                        faPaperPlane
                      } 
                    />
                    <span>{formStatus.message}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">
                        <FontAwesomeIcon icon={faUser} />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">
                        <FontAwesomeIcon icon={faEnvelope} />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="company">
                        <FontAwesomeIcon icon={faBuilding} />
                        Company/Organization
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Your Company Name"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="service">Service Needed</label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                      >
                        <option value="">Select a service</option>
                        {services.map((service, index) => (
                          <option key={index} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="budget">Project Budget</label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                      >
                        <option value="">Select budget range</option>
                        {budgetRanges.map((range, index) => (
                          <option key={index} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="timeline">Timeline</label>
                      <select
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                      >
                        <option value="">Select timeline</option>
                        {timelines.map((timeline, index) => (
                          <option key={index} value={timeline}>{timeline}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">
                      <FontAwesomeIcon icon={faComment} />
                      Project Details *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell me about your project, goals, target audience, and any specific requirements..."
                      rows="6"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={formStatus.type === 'loading'}
                  >
                    {formStatus.type === 'loading' ? (
                      <>
                        <div className="loading-spinner"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faPaperPlane} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="contact-info-section">
                <div className="info-header">
                  <h2>Get In Touch</h2>
                  <p>Choose your preferred way to connect</p>
                </div>

                <div className="contact-methods">
                  {contactMethods.map((method, index) => (
                    <div key={index} className="contact-method">
                      <div className="method-icon">
                        <FontAwesomeIcon icon={method.icon} />
                      </div>
                      <div className="method-info">
                        <h3>{method.title}</h3>
                        <div className="method-value">{method.value}</div>
                        <p>{method.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="availability-info">
                  <h3>
                    <FontAwesomeIcon icon={faClock} />
                    Availability
                  </h3>
                  <div className="availability-list">
                    {availability.map((item, index) => (
                      <div key={index} className="availability-item">
                        <span className="day">{item.day}</span>
                        <span className="hours">{item.hours}</span>
                      </div>
                    ))}
                  </div>
                  <div className="timezone-note">
                    <small>* All times in Pakistan Standard Time (PST)</small>
                  </div>
                </div>

                <div className="location-info">
                  <h3>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    Location
                  </h3>
                  <p>Based in Pakistan, serving clients worldwide</p>
                  <div className="location-features">
                    <div className="feature">✅ Remote collaboration</div>
                    <div className="feature">✅ Flexible time zones</div>
                    <div className="feature">✅ English proficiency</div>
                  </div>
                </div>

{/*                 <div className="quick-links">
                  <h3>Quick Links</h3>
                  <div className="social-links">
                    <a href="#" className="social-link">
                      <FontAwesomeIcon icon={faLinkedin} />
                      LinkedIn
                    </a>
                    <a href="#" className="social-link">
                      <FontAwesomeIcon icon={faUpwork} />
                      Upwork Profile
                    </a>
                    <a href="#" className="social-link">
                      <FontAwesomeIcon icon={faTelegram} />
                      Telegram
                    </a>
                    <a href="#" className="social-link">
                      <FontAwesomeIcon icon={faSkype} />
                      Skype
                    </a>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="contact-faq">
          <div className="container">
            <h2>Before You Reach Out</h2>
            <div className="faq-grid">
              <div className="faq-item">
                <h3>📋 What information should I include?</h3>
                <p>Please share your project goals, target audience, timeline, budget range, and any specific requirements or preferences you have.</p>
              </div>
              <div className="faq-item">
                <h3>⏱️ How quickly do you respond?</h3>
                <p>I typically respond within 24 hours during business days. For urgent projects, feel free to mention "URGENT" in your subject line.</p>
              </div>
              <div className="faq-item">
                <h3>💰 Do you provide free consultations?</h3>
                <p>Yes! I offer free 30-minute consultations to discuss your project needs and determine if we're a good fit to work together.</p>
              </div>
              <div className="faq-item">
                <h3>🌍 Do you work internationally?</h3>
                <p>Absolutely! I work with clients from all over the world and am experienced in managing projects across different time zones.</p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
