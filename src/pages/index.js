import React, { useRef,useState, useEffect } from "react";
import { Link } from "gatsby";
import { graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Helmet } from "react-helmet"; // Import Helmet
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
import "../styles/gallery.css";
import "../styles/smart-protection.css";
import myImage from "../profileimage/my_image.jpg";
import Header from "../components/Header";
import FeedbackSidebar from "../components/FeedbackSidebar";
import Footer from "../components/Footer";
import SmartProtection from "../components/SmartProtection";
import LikeButton from "../../LikeButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCommentDots } from "@fortawesome/free-solid-svg-icons"; // Import FontAwesome icons

// Set root element for modal accessibility
Modal.setAppElement("#___gatsby");

const PortfolioPage = ({ data }) => {
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
  const imageRef = useRef(null); // Ref for the image
  const [touchStart, setTouchStart] = useState(null); // Track touch start position
  const [touchEnd, setTouchEnd] = useState(null); // Track touch end position
  const [heroShrunk, setHeroShrunk] = useState(false); // Track hero section state
  const [scrollIndicatorVisible, setScrollIndicatorVisible] = useState(false);
  
  // Scroll to portfolio section function with hero shrinking
  const scrollToPortfolio = () => {
    setHeroShrunk(true);
    
    // Trigger portfolio section animations
    setTimeout(() => {
      const portfolioSection = document.querySelector('.portfolio-header');
      const galleryContainer = document.querySelector('.gallery-container');
      
      if (portfolioSection) {
        portfolioSection.classList.add('visible');
        portfolioSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
      
      if (galleryContainer) {
        galleryContainer.classList.add('visible');
      }
    }, 600); // Small delay for animation
  };

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
        
        // Trigger portfolio animations
        setTimeout(() => {
          const portfolioSection = document.querySelector('.portfolio-header');
          const galleryContainer = document.querySelector('.gallery-container');
          
          if (portfolioSection) {
            portfolioSection.classList.add('visible');
          }
          
          if (galleryContainer) {
            galleryContainer.classList.add('visible');
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

  useEffect(() => {
    if (typeof document !== "undefined") {
      const closeButton = document.querySelector('.close-button');
    }
  }, []);
  

//-----------------------------------------------------------------------  
  // Upload images from firebase
  const uploadImagesToFirebase = async () => {
    const imageUploadPromises = data.allFile.edges.map(async ({ node }) => {
      const imageName = node.relativePath;
      const docRef = doc(db, "projects", imageName);

      const docSnapshot = await getDoc(docRef);
      if (!docSnapshot.exists()) {
        await setDoc(docRef, {
          dateAdded: serverTimestamp(),
          likes: 0,
          comments: [],
        });
      }
    });

    await Promise.all(imageUploadPromises);
  };
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
  // Fetch images from firebase
  useEffect(() => {
    const fetchImagesWithMetadata = async () => {
      await uploadImagesToFirebase();

      const firestoreImages = [];
      const querySnapshot = await getDocs(collection(db, "projects"));

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
//-----------------------------------------------------------------------
  const sortedImages = images.slice().sort((a, b) => {
    if (sortCriteria === "Recent") {
      return b.dateAdded - a.dateAdded;
    } else if (sortCriteria === "Popular") {
      return b.likes - a.likes;
    } else if (sortCriteria === "Oldest") {
      return a.dateAdded - b.dateAdded;
    } else if (sortCriteria === "A-Z") {
      return a.title?.localeCompare(b.title || "") || 0;
    } else if (sortCriteria === "Z-A") {
      return b.title?.localeCompare(a.title || "") || 0;
    }
    return 0;
  });

  const handleSortChange = (event) => {
    setSortCriteria(event.target.value);
  };

  const openModal = (index) => {
    setCurrentIndex(index);
    setModalIsOpen(true);
    setIsZoomed(false); // Ensure the zoom state is reset when opening the modal
    setComments(sortedImages[index]?.comments || []);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setName("");
    setFeedback("");
  };
//-----------------------------------------------------------------------
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
          
          // Advanced anti-screenshot protection
          let screenshotAttempted = false;
          let protectionActive = true;
          let originalImageSrc = protectedImage.src;
          
          // Create a blank warning image for screenshot attempts
          const createWarningImage = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 600;
            const ctx = canvas.getContext('2d');
            
            // Fill with dark background
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add warning text
            ctx.fillStyle = '#ff4444';
            ctx.font = 'bold 48px Inter, Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🚫 PROTECTED CONTENT', canvas.width/2, canvas.height/2 - 60);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = '24px Inter, Arial, sans-serif';
            ctx.fillText('Screenshots are not permitted', canvas.width/2, canvas.height/2);
            ctx.fillText('© MUBASHIR UI HASSAN', canvas.width/2, canvas.height/2 + 40);
            
            return canvas.toDataURL();
          };
          
          const warningImageSrc = createWarningImage();
          
          // Screenshot detection and prevention
          const antiScreenshotProtection = () => {
            // Prevent Print Screen key
            const handleKeyDown = (e) => {
              if (protectionActive) {
                // Block Print Screen
                if (e.key === 'PrintScreen' || e.keyCode === 44) {
                  e.preventDefault();
                  screenshotAttempted = true;
                  
                  // Replace image content immediately
                  const protectedContainer = document.querySelector('.protected-fullscreen-container');
                  const img = protectedContainer?.querySelector('img');
                  if (img) {
                    img.src = warningImageSrc;
                    img.style.maxWidth = '80%';
                    img.style.maxHeight = '80%';
                  }
                  
                  // Show alert after brief delay
                  setTimeout(() => {
                    alert('🚫 Screenshot blocked! Protected content cannot be captured.');
                    // Restore original image after alert
                    if (img && !screenshotAttempted) {
                      img.src = originalImageSrc;
                    }
                  }, 100);
                  
                  return false;
                }
                
                // Prevent common dev tools shortcuts
                if (e.keyCode === 123 || // F12
                    (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 67)) || // Ctrl+Shift+I/C
                    (e.ctrlKey && e.keyCode === 85) || // Ctrl+U
                    (e.ctrlKey && e.shiftKey && e.keyCode === 75)) { // Ctrl+Shift+K
                  e.preventDefault();
                  return false;
                }
              }
            };
            
            // Detect window focus/blur (screenshot tools often cause this)
            let suspiciousActivity = 0;
            const handleBlur = () => {
              if (protectionActive) {
                suspiciousActivity++;
                const protectedContainer = document.querySelector('.protected-fullscreen-container');
                const img = protectedContainer?.querySelector('img');
                
                if (img && suspiciousActivity > 1) {
                  // Temporarily replace with warning
                  const originalSrc = img.src;
                  img.src = warningImageSrc;
                  
                  setTimeout(() => {
                    if (img && protectionActive && !screenshotAttempted) {
                      img.src = originalSrc;
                    }
                  }, 1000);
                }
              }
            };
            
            // Monitor visibility changes (another screenshot detection method)
            const handleVisibilityChange = () => {
              if (document.hidden && protectionActive) {
                const protectedContainer = document.querySelector('.protected-fullscreen-container');
                const img = protectedContainer?.querySelector('img');
                if (img) {
                  img.src = warningImageSrc;
                  // Keep warning image while hidden
                  setTimeout(() => {
                    if (!document.hidden && img && protectionActive) {
                      img.src = originalImageSrc;
                    }
                  }, 500);
                }
              }
            };
            
            // Add event listeners
            document.addEventListener('keydown', handleKeyDown, true);
            window.addEventListener('blur', handleBlur);
            document.addEventListener('visibilitychange', handleVisibilityChange);
            
            // Cleanup function
            return () => {
              protectionActive = false;
              document.removeEventListener('keydown', handleKeyDown, true);
              window.removeEventListener('blur', handleBlur);
              document.removeEventListener('visibilitychange', handleVisibilityChange);
            };
          };
          
          // Activate anti-screenshot protection
          const cleanupProtection = antiScreenshotProtection();
          
          // Handle fullscreen exit
          const handleFullscreenChange = () => {
            if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
              // Disable anti-screenshot protection
              if (cleanupProtection) {
                cleanupProtection();
              }
              
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
//---------------------------------------------------------------
//---------------------------------------------------------------
  //Handle the touch start and end events: 
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX); // Record the starting X position
  };
  
  const handleTouchEnd = (e) => {
    setTouchEnd(e.changedTouches[0].clientX); // Record the ending X position
  
    if (touchStart && touchEnd) {
      const swipeDistance = touchStart - touchEnd; // Calculate swipe distance
  
      if (swipeDistance > 50) {
        // Swipe left: Go to the next image
        setCurrentIndex((prevIndex) =>
          prevIndex === sortedImages.length - 1 ? 0 : prevIndex + 1
        );
      } else if (swipeDistance < -50) {
        // Swipe right: Go to the previous image
        setCurrentIndex((prevIndex) =>
          prevIndex === 0 ? sortedImages.length - 1 : prevIndex - 1
        );
      }
    }
  };
//---------------------------------------------------------------  
  
//---------------------------------------------------------------
  // Updated handleAddFeedback to accept name, feedback, and rating
  const handleAddFeedback = async (name, feedback, rating, imageIndex) => {
    if (!feedback.trim() || !name.trim() || rating === 0) return;
  
    const projectId = images[imageIndex]?.id;
    const projectRef = doc(db, "projects", projectId);
  
    const newComment = {
      name,
      text: feedback,
      rating,
      timestamp: new Date(),
    };
 

    // Step 1: Fetch the current comments for this specific project from Firestore
    const projectSnapshot = await getDoc(projectRef);
    const existingComments = projectSnapshot.exists()
      ? projectSnapshot.data().comments || [] // Existing comments if any
      : [];

  
    // Step 2: Update Firestore by appending the new comment to the existing comments
    await updateDoc(projectRef, {
      comments: [...existingComments, newComment],
    });

    // Step 3: Re-fetch the updated comments from Firestore
    const updatedSnapshot = await getDoc(projectRef);
    const updatedComments = updatedSnapshot.exists()
      ? updatedSnapshot.data().comments
      : [];

    // Step 4: Update the local `images` array with the new comments
    setImages((prevImages) => {
      const updatedImages = prevImages.map((image, index) => {
        if (index === imageIndex) {
          return {
            ...image,
            comments: updatedComments, // Set the updated comments for the current image
          };
        }
        return image;
      });
      return updatedImages;
    });
  };
//-----------------------------------------------------------------------
  
  const paginatedImages = sortedImages.slice(
    (currentPage-1)*itemsPerPage,//Start index
    currentPage*itemsPerPage//End index
  );

  const totalPages = Math.ceil(sortedImages.length/itemsPerPage)

  const goToNextPage =() =>
  {
    if (currentPage<totalPages)
    {
      setCurrentPage (currentPage+1);
      // Scroll to the top of the page
    window.scrollTo({
      top:20,
      left:0,
      behavior:"smooth",
    }

    )
    }
  };

  const goToPreviousPage = () =>{
    if (currentPage>1)
    {
      setCurrentPage(currentPage-1);
    }
  };
//---------------------------------------------------------------
  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        setCurrentIndex((prevIndex) =>
          prevIndex === 0 ? sortedImages.length - 1 : prevIndex - 1
        );
      }
      if (event.key === "ArrowRight") {
        setCurrentIndex((prevIndex) =>
          prevIndex === sortedImages.length - 1 ? 0 : prevIndex + 1
        );
      }
      if (event.key === "Escape") closeModal();
    };

    if (modalIsOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalIsOpen, sortedImages.length]);
//-----------------------------------------------------------------------

  return (
    <>
      <SmartProtection />
      <Helmet>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
        />
        <meta name="description" content="Professional UI/UX Portfolio by Mubashir UI Hassan - Creative Design Solutions" />
        <meta name="author" content="Mubashir UI Hassan" />
        <meta name="copyright" content="© 2025 Mubashir UI Hassan. All rights reserved." />
        <meta property="og:title" content="Mubashir UI Hassan - Portfolio" />
        <meta property="og:description" content="Creative UI/UX Design Portfolio" />
        <meta property="og:type" content="website" />
        <title>Mubashir UI Hassan - Protected Portfolio</title>
      </Helmet>
      <Header />
      <div className="content-wrapper">
        <div className={`content ${modalIsOpen ? "blurred" : ""}`}>
        {/* Hero Landing Section */}
        <div className={`hero-section ${heroShrunk ? 'shrunk' : ''}`}>
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-greeting">
                <span className="greeting-text">Hello, I'm</span>
                <div className="status-badge">
                  <span className="status-dot"></span>
                  Available for work
                </div>
              </div>
              <h1 className="hero-title">
                <span className="name-primary">MUBASHIR UI</span>
                <span className="name-secondary">Hassan</span>
              </h1>
              <h2 className="hero-subtitle">Senior UI/UX Designer & Isometric Illustration Specialist</h2>
              <p className="hero-description">
                I craft exceptional digital experiences through innovative design solutions. 
                Specializing in UI/UX design, brand identity, and <strong>3D isometric illustrations</strong> 
                for Fortune 500 companies and cutting-edge startups.
              </p>
              
              <div className="specialty-tags">
                <div className="specialty-tag">
                  <i className="fas fa-cube"></i>
                  <span>Isometric Design</span>
                </div>
                <div className="specialty-tag">
                  <i className="fas fa-city"></i>
                  <span>3D Cityscapes</span>
                </div>
                <div className="specialty-tag">
                  <i className="fas fa-cogs"></i>
                  <span>Technical Diagrams</span>
                </div>
                <div className="specialty-tag">
                  <i className="fas fa-mobile-alt"></i>
                  <span>App Interfaces</span>
                </div>
              </div>
              
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">5+</span>
                  <span className="stat-label">Years Experience</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">250+</span>
                  <span className="stat-label">Projects Completed</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">Client Satisfaction</span>
                </div>
              </div>

              <div className="hero-actions">
                <button className="cta-primary" onClick={scrollToPortfolio}>
                  <i className="fas fa-rocket"></i>
                  Explore My Work
                </button>
               <Link to="/contact" className="cta-secondary" style={{textDecoration: 'none'}}>
                  <i className="fas fa-paper-plane"></i>
                  Let's Work Together
                </Link>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-image-container">
                <div className="image-backdrop"></div>
                <img src={myImage} alt="Mubashir UI Hassan - Senior UI/UX Designer" className="hero-image" />
                <div className="image-decoration">
                  <div className="floating-element element-1"></div>
                  <div className="floating-element element-2"></div>
                  <div className="floating-element element-3"></div>
                </div>
              </div>
              
              <div className="location-card">
                <i className="fas fa-map-marker-alt"></i>
                <span>Based in Pakistan</span>
              </div>
            </div>
          </div>

          <div className={`hero-scroll ${scrollIndicatorVisible ? 'visible' : ''}`} onClick={scrollToPortfolio}>
            <span className="scroll-text">Scroll to explore</span>
            <div className="scroll-arrow">
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </div>

        {/* Portfolio categories and sorting controls */}
        <div className="portfolio-header">
          <div className="portfolio-categories">
            <button className="tab active">Isometric Illustrations</button>
            <Link to="/infographic" className="tab">
              Infographics
            </Link>
            <Link to="/linkedin" className="tab">LinkedIn Posts</Link>
            <button className="tab">Social Media</button>
            <button className="tab">Logos</button>
            <button className="tab">AI Generated</button>
          </div>

          {/* Sorting controls */}
          <div className="portfolio-controls">
            <select
              className="sort-dropdown"
              onChange={handleSortChange}
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

        {/* Gallery Section */}
        <div className="gallery-container">
          <h1>My Isometric Illustrations</h1>
          <p>Explore my collection of isometric illustrations below.</p>
          <div className="gallery-grid">
          {paginatedImages.map((image, index) => (
              <div
                key={index}
                className="gallery-item"
                onClick={() => openModal(index + (currentPage - 1) * itemsPerPage)}
              >
                <GatsbyImage
                  image={image.image}
                  alt="Isometric Illustration"
                  className="gallery-image"
                />
                {/* Protected copyright notice */}
                <div className="hidden-copyright">
                  © 2025 Mubashir UI Hassan - Original Work - All Rights Reserved
                  Unauthorized use prohibited - Licensed content only
                </div>
                {/* Title Hover Overlay */}
                <div className="image-title-overlay">
                  {image.title}
                </div>
                {/* Like Button on Hover */}
                <div className="like-button-hover">
                  <LikeButton projectId={image.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pagination-controls">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Previous
            </button>
            <span>
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
      <Footer />

      {/* Modal */}
      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Lightbox"
        className={`modal ${isZoomed ? "zoomed" : ""}`}
        overlayClassName="overlay"
      >
        
        <div className="modal-content"
        onTouchStart={(e) => handleTouchStart(e)} // Start of the swipe
        onTouchEnd={(e) => handleTouchEnd(e)} // End of the swipe
        >
          {sortedImages[currentIndex] && (
            <>
              <div className="modal-image-container" ref={imageRef}>
              {sortedImages[currentIndex] && (
                <img
                  src={sortedImages[currentIndex]?.image?.images?.fallback?.src}
                  alt="Enlarged Isometric Illustration"
                  onClick={toggleZoom}
                  style={{ cursor: "zoom-in", width: "100%", height: "auto" }}
                />
              )}
                <div className="modal-like-button">
                  <LikeButton projectId={sortedImages[currentIndex].id} />
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
        {/* Add a wrapper div with an ID for FeedbackSidebar */}
        {modalIsOpen && (
        <div id="feedback-container">
                      <FeedbackSidebar
                        images={images}
                        currentIndex={currentIndex}
                        handleAddFeedback={(name, feedback, rating) => handleAddFeedback(name, feedback, rating, currentIndex)}
                      />
                      </div>
              )}
      </div> {/* Close content-wrapper */}
    </>
    
  );
};

export const query = graphql`
  query {
    allFile(filter: { sourceInstanceName: { eq: "images" } }) {
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

export default PortfolioPage;
