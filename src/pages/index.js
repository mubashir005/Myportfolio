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
import myImage from "../profileimage/my_image.jpg";
import Header from "../components/Header";
import FeedbackSidebar from "../components/FeedbackSidebar";
import Footer from "../components/Footer";
import LikeButton from "../../LikeButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCommentDots } from "@fortawesome/free-solid-svg-icons"; // Import FontAwesome icons
import SlidingPanel from 'react-sliding-side-panel'; // Import the sliding panel

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
  // Toggle zoom on image
  const toggleZoom = () => {
    if (typeof document !== "undefined") {
      const imageElement = imageRef.current?.querySelector("img");
  
      if (imageElement) {
        if (!isZoomed) {
          if (imageElement.requestFullscreen) {
            imageElement.requestFullscreen();
          } else if (imageElement.webkitRequestFullscreen) {
            imageElement.webkitRequestFullscreen();
          } else if (imageElement.msRequestFullscreen) {
            imageElement.msRequestFullscreen();
          }
        } else {
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
      <Helmet>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
        />
      </Helmet>
      <Header />
      <div className={`content ${modalIsOpen ? "blurred" : ""}`}>
        {/* Profile Section */}
        <div className="profile-header">
          <img src={myImage} alt="Profile Picture" className="profile-image" />
          <div className="profile-info">
            <h2 className="profile-name">MUBASHIR UI Hassan</h2>
            <p className="profile-location">Pakistan</p>
            <p className="profile-description">
            Transforming concepts into captivating visuals for modern brands
            </p>
            <div className="profile-buttons">
                <button className="get-in-touch">Get in touch</button>
                <a
                  href="https://www.upwork.com/freelancers/~0179dc344f6192cef1?mp_source=share"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="upwork-button"
                >
                  Upwork Profile
                </a>
                <button className="more-options">...</button>
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
                <GatsbyImage image={image.image} alt="Isometric Illustration" />
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
                  src={sortedImages[currentIndex]?.image?.images?.fallback?.src
                  } // Get the source URL
                  alt="Enlarged Isometric Illustration"
                  onClick={toggleZoom} // Click to toggle fullscreen
                  style={{ cursor: "zoom-in", width: "100%", height: "auto" }} // Add styles
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
