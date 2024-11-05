import React, { useState, useEffect } from "react";
import { graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Modal from "react-modal";
import "../styles/gallery.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

Modal.setAppElement("#___gatsby");

const PortfolioPage = ({ data }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = data.allFile.edges.map(({ node }) => getImage(node.childImageSharp));

  const openModal = (index) => {
    setCurrentIndex(index);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const goToPreviousImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        goToPreviousImage();
      } else if (event.key === "ArrowRight") {
        goToNextImage();
      } else if (event.key === "Escape") {
        closeModal();
      }
    };

    if (modalIsOpen) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalIsOpen]);

  return (
    <>
      <Header />
      <div className="gallery-container">
        <h1>My Isometric Illustrations</h1>
        <p>Explore my collection of isometric illustrations below.</p>
        <div className="gallery-grid">
          {images.map((image, index) => (
            <div
              key={index}
              className="gallery-item"
              onClick={() => openModal(index)}
            >
              <GatsbyImage image={image} alt="Isometric Illustration" />
            </div>
          ))}
        </div>
      </div>
      <Footer />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Lightbox"
        className="modal"
        overlayClassName="overlay"
      >
        {images[currentIndex] && (
          <GatsbyImage image={images[currentIndex]} alt="Enlarged Isometric Illustration" />
        )}
        <button onClick={closeModal} className="close-button">Close</button>
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
