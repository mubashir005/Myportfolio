import React, { useState, useEffect } from "react";
import { graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Modal from "react-modal";
import "../styles/gallery.css";
import myImage from "../profileimage/my_image.jpg";
import icon from "../profileimage/heart.png";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LikeButton from "../../LikeButton";


// Set root element for modal accessibility
Modal.setAppElement("#___gatsby");

const PortfolioPage = ({ data }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Fetch images
  const images = data.allFile.edges.map(({ node }) => getImage(node.childImageSharp));


  // Open modal with the selected image
  const openModal = (index) => {
    setCurrentIndex(index);
    setModalIsOpen(true);
    setIsZoomed(false); // Reset zoom state
  };

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Toggle zoom effect
  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  // Navigate to the previous image
  const goToPreviousImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  // Navigate to the next image
  const goToNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") goToPreviousImage();
      if (event.key === "ArrowRight") goToNextImage();
      if (event.key === "Escape") closeModal();
    };

    if (modalIsOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalIsOpen]);

  // Portfolio categories tab interactivity
  useEffect(() => {
    // Toggle active class on tab click
    document.querySelectorAll(".portfolio-categories .tab").forEach((tab) => {
      tab.addEventListener("click", function () {
        document.querySelector(".portfolio-categories .tab.active").classList.remove("active");
        this.classList.add("active");
        // Optional: Add filtering functionality for categories
      });
    });

    // Cleanup listeners on component unmount
    return () => {
      document.querySelectorAll(".portfolio-categories .tab").forEach((tab) => {
        tab.removeEventListener("click", () => {});
      });
    };
  }, []);

  return (
    <>
    
    <Header />
    <div className={`content ${modalIsOpen ? "blurred" : ""}`}>
      {/* Profile Section */}
      <div className="profile-header">
        <img src={myImage} alt="Profile Picture" className="profile-image" />
        <div className="profile-info">
          <h2 className="profile-name">MUBASHIR UI Hassan</h2>
          <p className="profile-location">Pakistan</p>
          <p className="profile-description">Brand / Graphic Design, Illustration, UI / Visual Design</p>
          <div className="profile-buttons">
            <button className="get-in-touch">Get in touch</button>
            <button className="edit-profile">Edit Profile</button>
            <button className="more-options">...</button>
          </div>
        </div>
      </div>

      {/* Flex container for categories and controls */}
      <div className="portfolio-header">
        <div className="portfolio-categories">
          <button className="tab active">Isometric Illustrations</button>
          <button className="tab">Infographics</button>
          <button className="tab">Social Media</button>
          <button className="tab">Logos</button>
          <button className="tab">AI Generated</button>
        </div>

        {/* Right-side controls relevant to portfolio */}
        <div className="portfolio-controls">
          <select className="sort-dropdown">
            <option>Sort by: Recent</option>
            <option>Sort by: Popular</option>
            <option>Sort by: Favorites</option>
          </select>
          <button className="boost-button">Boost Project</button>
        </div>
      </div>
      {/* Gallery Section */}
      <div className="gallery-container">
        <h1>My Isometric Illustrations</h1>
        <p>Explore my collection of isometric illustrations below.</p>
        <div className="gallery-grid">
          {images.map((image, index) => (
            <div key={index} className="gallery-item" onClick={() => openModal(index)}>
              <GatsbyImage image={image} alt="Isometric Illustration" />
              {/* Like Button on Hover */}
              <div className="like-button-hover">
                <LikeButton projectId={`project-${index}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer />

    {/* Modal */}
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Image Lightbox"
      className={`modal ${isZoomed ? "zoomed" : ""}`}
      overlayClassName="overlay"
    >
      <button onClick={closeModal} className="close-button">×</button>
      <div className="modal-content">
        {images[currentIndex] && (
          <div className="modal-image-container" onClick={toggleZoom}>
            <GatsbyImage image={images[currentIndex]} alt="Enlarged Isometric Illustration" />
          </div>
        )}
      </div>
    </Modal>
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
