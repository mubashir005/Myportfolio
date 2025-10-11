import React, { useRef,useState, useEffect } from "react";
import { Link } from "gatsby";
import { graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Helmet } from "react-helmet"; 
import { render } from "react-dom";
import Modal from "react-modal";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "../profileimage/gallery2.css";
import "../styles/gallery.css";
import "../styles/smart-protection.css";
import myImage from "../profileimage/my_image.jpg";
import Header from "../components/Header";
import FeedbackSidebar from "../components/FeedbackSidebar";
import Footer from "../components/Footer";
import SmartProtection from "../components/SmartProtection";
import LikeButtonLinkedIn from "../../LikeButtonLinkedIn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCommentDots } from "@fortawesome/free-solid-svg-icons"; // Import FontAwesome icons


// Set root element for modal accessibility
Modal.setAppElement("#___gatsby");

const LinkedInPosts = ({ data }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false); // Track zoom state of the image
  const [sortCriteria, setSortCriteria] = useState("Popular");
  const [images, setImages] = useState([]);
  const [name, setName] = useState(""); // New state for name input
  const [feedback, setFeedback] = useState(""); // Input for feedback
  const [comments, setComments] = useState([]); // List of comments for the current project
  const [openPanel, setOpenPanel] = useState(false); // Control the sidebar visibility
  const[currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100; //number of image per page
  const [touchStart, setTouchStart] = useState(null); // Track touch start position
  const [touchEnd, setTouchEnd] = useState(null); // Track touch end position
  const [heroShrunk, setHeroShrunk] = useState(false); // Track hero section state
  const [scrollIndicatorVisible, setScrollIndicatorVisible] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      setScrollIndicatorVisible(true);
      const timer = setTimeout(() => setScrollIndicatorVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Interactive hero behavior
  useEffect(() => {
    // Show scroll indicator after initial animations
    const timer = setTimeout(() => {
      setScrollIndicatorVisible(true);
    }, 2500);

    // Handle scroll events to auto-shrink hero on scroll
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroHeight = window.innerHeight * 0.4; // 40% of viewport height
      
      if (scrollPosition > heroHeight && !heroShrunk) {
        setHeroShrunk(true);
        
        // Trigger gallery animations
        setTimeout(() => {
          const portfolioSection = document.querySelector('.portfolio-header');
          const gallerySection = document.querySelector('.gallery-container');
          
          if (portfolioSection) {
            portfolioSection.classList.add('visible');
          }
          
          if (gallerySection) {
            gallerySection.classList.add('visible');
          }
        }, 400);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [heroShrunk]);

  // Scroll to gallery function with hero shrinking
  const scrollToGallery = () => {
    setHeroShrunk(true);
    
    // Trigger gallery animations
    setTimeout(() => {
      const portfolioSection = document.querySelector('.portfolio-header');
      const gallerySection = document.querySelector('.gallery-container');
      
      if (portfolioSection) {
        portfolioSection.classList.add('visible');
      }
      
      if (gallerySection) {
        gallerySection.classList.add('visible');
        gallerySection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 600); // Small delay for animation
  };
  
  const imageRef = useRef(null); // Ref for the image

  // Make portfolio header visible on component mount
  useEffect(() => {
    const portfolioSection = document.querySelector('.portfolio-header');
    if (portfolioSection) {
      portfolioSection.classList.add('visible');
    }
  }, []);

  // Scroll function for hero section
  const scrollToPortfolio = () => {
    const portfolioSection = document.querySelector('.portfolio-header');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };  // Upload images to Firebase
  const uploadImagesToFirebase = async () => {
    const uploadPromises = data.allFile.edges.map(async ({ node }) => {
      const imageName = node.relativePath;
      const docRef = doc(db, "linkedin_posts", imageName);
      
      try {
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            title: imageName.replace(/\.(jpg|jpeg|png|gif)$/i, "").replace(/[-_]/g, " "),
            dateAdded: serverTimestamp(),
            likes: 0,
            comments: [],
          });
          console.log(`Uploaded: ${imageName}`);
        }
      } catch (error) {
        console.error(`Error uploading ${imageName}:`, error);
      }
    });

    await Promise.all(uploadPromises);
  };

  // Fetch images with metadata from Firestore
  useEffect(() => {
    const fetchImagesWithMetadata = async () => {
      await uploadImagesToFirebase();

      const firestoreImages = [];
      const querySnapshot = await getDocs(collection(db, "linkedin_posts"));

      querySnapshot.forEach((doc) => {
        const imageName = doc.id;
        const imageNode = data.allFile.edges.find(
          (edge) => edge.node.relativePath === imageName
        );

        if (imageNode) {
          firestoreImages.push({
            id: doc.id,
            image: getImage(imageNode.node.childImageSharp),
            title: doc.data().title || "",
            dateAdded: doc.data().dateAdded
              ? new Date(doc.data().dateAdded.seconds * 1000)
              : new Date(),
            likes: doc.data().likes || 0,
            comments: doc.data().comments || [],
          });
        }
      });

      setImages(firestoreImages);
    };

    fetchImagesWithMetadata();
  }, [data.allFile.edges]);

  // Sorting logic
  const sortedImages = [...images].sort((a, b) => {
    switch (sortCriteria) {
      case "Popular":
        return b.likes - a.likes;
      case "Recent":
        return b.dateAdded - a.dateAdded;
      case "Oldest":
        return a.dateAdded - b.dateAdded;
      case "A-Z":
        return a.title.localeCompare(b.title);
      case "Z-A":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedImages.length / itemsPerPage);
  const paginatedImages = sortedImages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  // Modal functions
  const openModal = (index) => {
    setCurrentIndex(index);
    setModalIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setIsZoomed(false);
    document.body.style.overflow = "auto";
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sortedImages.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? sortedImages.length - 1 : prevIndex - 1
    );
  };

  // Touch handlers for swipe navigation
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const threshold = 50;

    if (distance > threshold) {
      goToNext();
    } else if (distance < -threshold) {
      goToPrevious();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (modalIsOpen) {
        switch (e.key) {
          case "ArrowRight":
            goToNext();
            break;
          case "ArrowLeft":
            goToPrevious();
            break;
          case "Escape":
            closeModal();
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [modalIsOpen]);

  // Enhanced Toggle zoom with protection
  const toggleZoom = () => {
    if (typeof document !== "undefined") {
      const imageElement = imageRef.current?.querySelector("img");
  
      if (imageElement) {
        if (!isZoomed) {
          // Apply protection to fullscreen mode
          const fullscreenContainer = document.createElement('div');
          fullscreenContainer.className = 'protected-fullscreen-container';
          fullscreenContainer.innerHTML = `
            <div class="fullscreen-protection-overlay">
              <div class="protection-watermark">© MUBASHIR UI HASSAN</div>
              <div class="protection-warning">⚠️ Protected Content</div>
            </div>
          `;
          
          // Clone and protect the image
          const protectedImage = imageElement.cloneNode();
          protectedImage.oncontextmenu = (e) => e.preventDefault();
          protectedImage.ondragstart = (e) => e.preventDefault();
          protectedImage.onselectstart = (e) => e.preventDefault();
          
          fullscreenContainer.appendChild(protectedImage);
          document.body.appendChild(fullscreenContainer);
          
          // Request fullscreen on the protected container
          if (fullscreenContainer.requestFullscreen) {
            fullscreenContainer.requestFullscreen();
          } else if (fullscreenContainer.webkitRequestFullscreen) {
            fullscreenContainer.webkitRequestFullscreen();
          } else if (fullscreenContainer.msRequestFullscreen) {
            fullscreenContainer.msRequestFullscreen();
          }
          
          // Apply protection styles
          const protectionStyle = document.createElement('style');
          protectionStyle.id = 'fullscreen-protection-styles';
          protectionStyle.textContent = `
            .protected-fullscreen-container {
              position: relative;
              width: 100vw;
              height: 100vh;
              background: #000;
              display: flex;
              align-items: center;
              justify-content: center;
              user-select: none;
              -webkit-user-select: none;
              -moz-user-select: none;
            }
            .protected-fullscreen-container img {
              max-width: 95%;
              max-height: 95%;
              object-fit: contain;
              pointer-events: none;
              user-select: none;
              -webkit-user-drag: none;
              filter: brightness(0.95);
            }
            .fullscreen-protection-overlay {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              pointer-events: none;
              z-index: 1000;
            }
            .protection-watermark {
              position: absolute;
              top: 20px;
              right: 20px;
              color: rgba(255, 255, 255, 0.01);
              font-size: 16px;
              font-weight: bold;
              text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
              font-family: 'Inter', sans-serif;
            }
            .protection-warning {
              position: absolute;
              bottom: 20px;
              left: 20px;
              color: rgba(255, 255, 255, 0.008);
              font-size: 14px;
              font-weight: 500;
              text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
            }
          `;
          document.head.appendChild(protectionStyle);
          
          // Handle fullscreen exit
          const handleFullscreenChange = () => {
            if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
              // Remove protection elements
              const container = document.querySelector('.protected-fullscreen-container');
              const styles = document.getElementById('fullscreen-protection-styles');
              if (container) container.remove();
              if (styles) styles.remove();
              setIsZoomed(false);
              
              // Remove event listener
              document.removeEventListener('fullscreenchange', handleFullscreenChange);
              document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
              document.removeEventListener('msfullscreenchange', handleFullscreenChange);
            }
          };
          
          document.addEventListener('fullscreenchange', handleFullscreenChange);
          document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
          document.addEventListener('msfullscreenchange', handleFullscreenChange);
          
        } else {
          // Exit fullscreen
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        }
        setIsZoomed(!isZoomed);
      }
    }
  };

  // Hero section interaction
  const handleHeroInteraction = () => {
    setHeroShrunk(true);
  };

  // Feedback functions
  const handleSubmitFeedback = async (feedbackName, feedbackText, rating) => {
    if (!feedbackText?.trim() || !feedbackName?.trim()) {
      alert("Please provide both name and feedback.");
      return;
    }

    if (!sortedImages[currentIndex]) return;

    const projectId = sortedImages[currentIndex].id;
    const docRef = doc(db, "linkedin_posts", projectId);

    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const currentComments = docSnap.data().comments || [];
        const newComment = {
          name: feedbackName,
          feedback: feedbackText,
          rating: rating || 0,
          timestamp: new Date(),
        };

        await updateDoc(docRef, {
          comments: [...currentComments, newComment],
        });

        setComments([...currentComments, newComment]);
        alert("Thank you for your feedback!");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    }
  };

  // Load comments for current project
  useEffect(() => {
    const loadComments = async () => {
      if (!sortedImages[currentIndex]) return;

      const projectId = sortedImages[currentIndex].id;
      const docRef = doc(db, "linkedin_posts", projectId);

      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setComments(docSnap.data().comments || []);
        }
      } catch (error) {
        console.error("Error loading comments:", error);
      }
    };

    if (modalIsOpen) {
      loadComments();
    }
  }, [currentIndex, modalIsOpen, sortedImages]);

  return (
    <>
      <Helmet>
        <title>LinkedIn Posts - UI/UX Portfolio</title>
        <meta name="description" content="Collection of LinkedIn post designs and social media graphics created by Mubashir UI Hassan" />
        <meta name="keywords" content="LinkedIn posts, social media design, UI design, graphics, portfolio" />
      </Helmet>

      <div className="linkedin-posts-page">
        <Header />

        {/* Hero Section */}
        <section className={`hero-section ${heroShrunk ? 'shrunk' : ''}`}>
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-greeting">
                <span className="greeting-text">Hello there!</span>
                <div className="status-badge">
                  <div className="status-dot"></div>
                  Available for work
                </div>
              </div>

              <h1 className="hero-title">
                <span className="name-primary">MUBASHIR UI</span>
                <span className="name-secondary">Hassan</span>
              </h1>

              <h2 className="hero-subtitle">LinkedIn Post Designer</h2>

              <p className="hero-description">
                Creating engaging LinkedIn posts and social media graphics that captivate audiences and drive meaningful interactions with professional design excellence.
              </p>

              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">5+</span>
                  <span className="stat-label">Years Experience</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">200+</span>
                  <span className="stat-label">LinkedIn Posts</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">Client Satisfaction</span>
                </div>
              </div>

              <div className="hero-actions">
                <button className="cta-primary" onClick={scrollToGallery}>
                  <i className="fas fa-rocket"></i>
                  Explore LinkedIn Posts
                </button>
                <Link to="/contact" className="cta-secondary" style={{textDecoration: 'none'}}>
                  <i className="fas fa-paper-plane"></i>
                  Let's Work Together
                </Link>
              </div>

              {/* <div className="hero-social">
                <span className="social-label">Follow me:</span>
                <div className="social-links">
                  <a href="#" className="social-link">
                    <i className="fab fa-behance"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-dribbble"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-linkedin"></i>
                  </a>
                </div>
              </div> */}
            </div>

            <div className="hero-visual">
              <div className="hero-image-container">
                <div className="image-backdrop"></div>
                <img src={myImage} alt="Mubashir UI Hassan" className="hero-image" />
                <div className="image-decoration">
                  <div className="floating-element element-1"></div>
                  <div className="floating-element element-2"></div>
                  <div className="floating-element element-3"></div>
                </div>
                <div className="location-card">
                  <i className="fas fa-map-marker-alt"></i>
                  Pakistan
                </div>
              </div>
            </div>
          </div>

          <div className={`hero-scroll ${scrollIndicatorVisible ? 'visible' : ''}`} onClick={scrollToGallery}>
            <span className="scroll-text">Explore</span>
            <i className="fas fa-chevron-down scroll-arrow"></i>
          </div>
        </section>

        {/* Portfolio categories and sorting controls */}
        <div className="portfolio-header">
          <div className="portfolio-categories">
            <Link to="/" className="tab">
             Isometric Illustrations
            </Link>
            <Link to="/infographic" className="tab">Infographics</Link>
            <button className="tab active">LinkedIn Posts</button>
            <button className="tab">Social Media</button>
            <button className="tab">Logos</button>
            <button className="tab">AI Generated</button>
          </div>

          {/* Sorting controls */}
          <div className="portfolio-controls">
            <select
              className="sort-dropdown"
              onChange={(e) => setSortCriteria(e.target.value)}
              value={sortCriteria}
            >
              <option value="Recent">Sort by: Recent</option>
              <option value="Popular">Sort by: Popular</option>
              <option value="Oldest">Sort by: Oldest</option>
              <option value="A-Z">Sort by: A-Z</option>
              <option value="Z-A">Sort by: Z-A</option>
            </select>
            <button className="boost-button">Get Offer</button>
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="content-wrapper">
          <div className={`content ${modalIsOpen ? "blurred" : ""}`}>
            

          {/* Gallery Section */}
          <div className="gallery-container">
            <h1>LinkedIn Post Collection</h1>
            <p>Explore my collection of engaging LinkedIn post designs and social media graphics below.</p>
            <div className="gallery-grid">
                {paginatedImages.map((image, index) => (
                  <div
                    key={index}
                    className="gallery-item"
                    onClick={() => openModal(index + (currentPage - 1) * itemsPerPage)}
                  >
                    <GatsbyImage image={image.image} alt="LinkedIn Post Design" />
                    {/* Title Hover Overlay */}
                    <div className="image-title-overlay">
                      {image.title}
                    </div>
                    {/* Like Button on Hover */}
                    <div className="like-button-hover">
                      <LikeButtonLinkedIn projectId={image.id} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="pagination-controls">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="LinkedIn Post Modal"
          className={`modal ${isZoomed ? "zoomed" : ""}`}
          overlayClassName="overlay"
        >
          <div className="modal-content"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {sortedImages[currentIndex] && (
              <>
                <div className="modal-image-container" ref={imageRef}>
                  {sortedImages[currentIndex] && (
                    <img
                      src={sortedImages[currentIndex]?.image?.images?.fallback?.src}
                      alt="Enlarged LinkedIn Post"
                      onClick={toggleZoom}
                      style={{ cursor: "zoom-in", width: "100%", height: "auto" }}
                    />
                  )}
                  <div className="modal-like-button">
                    <LikeButtonLinkedIn projectId={sortedImages[currentIndex].id} />
                  </div>
                </div>
              </>
            )}
          </div>
        </Modal>

        {modalIsOpen && (
          <button onClick={closeModal} className="close-button">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}

        {/* Feedback Sidebar */}
        {modalIsOpen && (
          <div id="feedback-container">
            <FeedbackSidebar
              images={sortedImages}
              currentIndex={currentIndex}
              handleAddFeedback={handleSubmitFeedback}
            />
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export const query = graphql`
  query {
    allFile(filter: { sourceInstanceName: { eq: "linkedin_images" } }) {
      edges {
        node {
          id
          childImageSharp {
            gatsbyImageData(width: 1200, placeholder: BLURRED)
          }
          relativePath
        }
      }
    }
  }
`;

export default LinkedInPosts;
