import React, { useState, useEffect } from "react";
import { Link } from "gatsby";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPalette,
  faMobile,
  faDesktop,
  faBullhorn,
  faCode,
  faPencilRuler,
  faRocket,
  faCheckCircle,
  faClock,
  faUsers,
  faArrowRight,
  faQuestionCircle,
  faChevronDown,
  faChevronUp
} from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/gallery.css";
import "../styles/services.css";

const Services = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activePackage, setActivePackage] = useState(0);
  const [openFAQ, setOpenFAQ] = useState(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const services = [
    {
      icon: faDesktop,
      title: "UI/UX Design",
      description: "User-centered design solutions for web and mobile applications",
      features: ["User Research", "Wireframing", "Prototyping", "Usability Testing"],
      price: "Starting at $500"
    },
    {
      icon: faMobile,
      title: "Mobile App Design",
      description: "Native and cross-platform mobile application design",
      features: ["iOS Design", "Android Design", "App Store Graphics", "Interactive Prototypes"],
      price: "Starting at $800"
    },
    {
      icon: faPalette,
      title: "Brand Identity",
      description: "Complete brand identity design and visual guidelines",
      features: ["Logo Design", "Brand Guidelines", "Business Cards", "Stationery Design"],
      price: "Starting at $600"
    },
    {
      icon: faDesktop,
      title: "Web Design",
      description: "Modern, responsive website design and development",
      features: ["Responsive Design", "Landing Pages", "E-commerce Design", "CMS Integration"],
      price: "Starting at $700"
    },
    {
      icon: faBullhorn,
      title: "Digital Marketing",
      description: "Social media graphics and digital marketing materials",
      features: ["Social Media Graphics", "Ad Banners", "Infographics", "Email Templates"],
      price: "Starting at $300"
    },
    {
      icon: faPencilRuler,
      title: "Graphic Design",
      description: "Print and digital graphic design solutions",
      features: ["Poster Design", "Brochures", "Flyers", "Presentation Design"],
      price: "Starting at $250"
    }
  ];

  const packages = [
    {
      name: "Starter",
      price: "$299",
      duration: "5-7 days",
      description: "Perfect for small projects and quick design needs",
      features: [
        "3 Design Concepts",
        "2 Revisions",
        "High-res Files",
        "Basic Support",
        "Source Files"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$699",
      duration: "10-14 days", 
      description: "Ideal for comprehensive design projects",
      features: [
        "5 Design Concepts",
        "Unlimited Revisions",
        "High-res Files",
        "Priority Support",
        "Source Files",
        "Brand Guidelines",
        "Multiple Formats"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$1299",
      duration: "15-21 days",
      description: "Complete design solution for large-scale projects",
      features: [
        "Unlimited Concepts",
        "Unlimited Revisions",
        "All File Formats",
        "24/7 Support",
        "Complete Source Files",
        "Brand Guidelines",
        "Marketing Materials",
        "3D Mockups",
        "Animation Files"
      ],
      popular: false
    }
  ];

  const process = [
    {
      step: "01",
      title: "Discovery",
      description: "Understanding your needs, goals, and target audience"
    },
    {
      step: "02", 
      title: "Research",
      description: "Market research and competitive analysis"
    },
    {
      step: "03",
      title: "Design",
      description: "Creating initial concepts and design solutions"
    },
    {
      step: "04",
      title: "Refine",
      description: "Iterating based on feedback and requirements"
    },
    {
      step: "05",
      title: "Deliver",
      description: "Final delivery with all assets and documentation"
    }
  ];

  const faqs = [
    {
      question: "How long does a typical project take?",
      answer: "Project timelines vary depending on scope and complexity. Simple projects like logo design take 5-7 days, while comprehensive branding projects can take 2-4 weeks. I'll provide a detailed timeline during our initial consultation."
    },
    {
      question: "Do you offer revisions?",
      answer: "Yes! All packages include revisions. The Starter package includes 2 revisions, Professional includes unlimited revisions, and Enterprise offers unlimited revisions with priority support."
    },
    {
      question: "What file formats do you provide?",
      answer: "I provide all necessary file formats including PNG, JPG, SVG, PDF, and source files (AI, PSD, Sketch, Figma). Enterprise packages include additional formats and 3D mockups."
    },
    {
      question: "Do you work with international clients?",
      answer: "Absolutely! I work with clients worldwide and am experienced in different time zones. Communication is handled through email, video calls, and project management tools."
    },
    {
      question: "What's your payment structure?",
      answer: "I typically require 50% upfront and 50% upon project completion. For larger projects, we can discuss milestone-based payments. I accept payments through various methods including bank transfer and PayPal."
    },
    {
      question: "Do you sign NDAs?",
      answer: "Yes, I'm happy to sign NDAs and confidentiality agreements to protect your project information and business details."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <>
      <Helmet>
        <title>Services - Professional UI/UX Design | Mubashir UI Hassan</title>
        <meta name="description" content="Professional UI/UX design services including web design, mobile app design, branding, and digital marketing. Get a quote for your next project." />
        <meta name="keywords" content="UI design services, UX design, web design, mobile app design, branding, graphic design, digital marketing" />
      </Helmet>

      <div className={`services-page ${isLoaded ? 'loaded' : ''}`}>
        <Header />

        {/* Hero Section */}
        <section className="services-hero">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="services-title">
                <span className="title-highlight">Services</span> & Solutions
              </h1>
              <p className="services-subtitle">
                Transforming ideas into exceptional digital experiences through strategic design
              </p>
              
              <div className="hero-features">
                <div className="feature-item">
                  <FontAwesomeIcon icon={faRocket} />
                  <span>Fast Delivery</span>
                </div>
                <div className="feature-item">
                  <FontAwesomeIcon icon={faUsers} />
                  <span>500+ Happy Clients</span>
                </div>
                <div className="feature-item">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <span>100% Satisfaction</span>
                </div>
              </div>

              <div className="hero-cta">
                <Link to="/contact" className="btn-primary">
                  <FontAwesomeIcon icon={faArrowRight} />
                  Get Started Today
                </Link>
                <button className="btn-secondary">
                  View Portfolio
                </button>
              </div>
            </div>

            <div className="hero-visual">
              <div className="services-showcase">
                <div className="showcase-main">
                  <div className="main-service-card">
                    <div className="card-glow"></div>
                    <FontAwesomeIcon icon={faDesktop} className="main-icon" />
                    <h3>UI/UX Design</h3>
                    <p>Professional Design Solutions</p>
                    <div className="card-shine"></div>
                  </div>
                </div>
                
                <div className="showcase-orbit">
                  {services.slice(1, 6).map((service, index) => (
                    <div 
                      key={index} 
                      className={`orbit-item orbit-${index + 1}`}
                      style={{ '--delay': `${index * 0.2}s` }}
                    >
                      <div className="orbit-card">
                        <FontAwesomeIcon icon={service.icon} />
                        <span className="orbit-tooltip">{service.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="showcase-particles">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className={`particle particle-${i + 1}`}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="services-grid-section">
          <div className="container">
            <div className="section-header">
              <h2>What I Offer</h2>
              <p>Comprehensive design services tailored to your business needs</p>
            </div>

            <div className="services-grid">
              {services.map((service, index) => (
                <div key={index} className="service-card">
                  <div className="service-icon">
                    <FontAwesomeIcon icon={service.icon} />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  
                  <ul className="service-features">
                    {service.features.map((feature, idx) => (
                      <li key={idx}>
                        <FontAwesomeIcon icon={faCheckCircle} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="service-footer">
                    <div className="service-price">{service.price}</div>
                    <Link to="/contact" className="service-cta">
                      Get Quote
                      <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section className="packages-section">
          <div className="container">
            <div className="section-header">
              <h2>Design Packages</h2>
              <p>Choose the perfect package for your project needs</p>
            </div>

            <div className="packages-grid">
              {packages.map((pkg, index) => (
                <div key={index} className={`package-card ${pkg.popular ? 'popular' : ''}`}>
                  {pkg.popular && <div className="popular-badge">Most Popular</div>}
                  
                  <div className="package-header">
                    <h3>{pkg.name}</h3>
                    <div className="package-price">{pkg.price}</div>
                    <div className="package-duration">
                      <FontAwesomeIcon icon={faClock} />
                      {pkg.duration}
                    </div>
                  </div>

                  <p className="package-description">{pkg.description}</p>

                  <ul className="package-features">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx}>
                        <FontAwesomeIcon icon={faCheckCircle} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link to="/contact" className="package-cta">
                    Choose Package
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="process-section">
          <div className="container">
            <div className="section-header">
              <h2>My Design Process</h2>
              <p>A proven methodology that delivers exceptional results</p>
            </div>

            <div className="process-timeline">
              {process.map((step, index) => (
                <div key={index} className="process-step">
                  <div className="step-number">{step.step}</div>
                  <div className="step-content">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                  {index < process.length - 1 && <div className="step-connector"></div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="container">
            <div className="section-header">
              <h2>Frequently Asked Questions</h2>
              <p>Get answers to common questions about my design services</p>
            </div>

            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <button 
                    className={`faq-question ${openFAQ === index ? 'active' : ''}`}
                    onClick={() => toggleFAQ(index)}
                  >
                    <span>{faq.question}</span>
                    <FontAwesomeIcon 
                      icon={openFAQ === index ? faChevronUp : faChevronDown} 
                    />
                  </button>
                  <div className={`faq-answer ${openFAQ === index ? 'open' : ''}`}>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="services-cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Start Your Project?</h2>
              <p>Let's discuss your design needs and create something amazing together</p>
              <div className="cta-actions">
                <Link to="/contact" className="btn-primary large">
                  <FontAwesomeIcon icon={faArrowRight} />
                  Get Free Consultation
                </Link>
                <Link to="/" className="btn-secondary large">
                  View Portfolio
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Services;
