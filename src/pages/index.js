import React, { useState, useEffect } from "react";
import { graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
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
import Footer from "../components/Footer";
import LikeButton from "../../LikeButton";

// Set root element for modal accessibility
Modal.setAppElement("#___gatsby");

const PortfolioPage = ({ data }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false); // Track zoom state of the image
  const [sortCriteria, setSortCriteria] = useState("Recent");
  const [images, setImages] = useState([]);
  const [name, setName] = useState(""); // New state for name input
  const [feedback, setFeedback] = useState(""); // Input for feedback
  const [comments, setComments] = useState([]); // List of comments for the current project

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

  // Toggle zoom on image
  const toggleZoom = () => {
    setIsZoomed(!isZoomed); // Zoom only the image
  };

  const handleAddFeedback = async () => {
    if (!feedback.trim() || !name.trim()) return; // Prevent empty submission

    const projectId = sortedImages[currentIndex]?.id;
    const projectRef = doc(db, "projects", projectId);

    const newComment = {
      name, // Save name
      text: feedback,
      timestamp: new Date(),
    };

    await updateDoc(projectRef, {
      comments: [...comments, newComment],
    });

    setComments((prevComments) => [...prevComments, newComment]);
    setName(""); // Clear name input
    setFeedback(""); // Clear feedback input
  };

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
            <p className="profile-description">
              Brand / Graphic Design, Illustration, UI / Visual Design
            </p>
            <div className="profile-buttons">
              <button className="get-in-touch">Get in touch</button>
              <button className="edit-profile">Edit Profile</button>
              <button className="more-options">...</button>
            </div>
          </div>
        </div>

        {/* Portfolio categories and sorting controls */}
        <div className="portfolio-header">
          <div className="portfolio-categories">
            <button className="tab active">Isometric Illustrations</button>
            <button className="tab">Infographics</button>
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
            <button className="boost-button">Boost Project</button>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="gallery-container">
          <h1>My Isometric Illustrations</h1>
          <p>Explore my collection of isometric illustrations below.</p>
          <div className="gallery-grid">
            {sortedImages.map((image, index) => (
              <div
                key={index}
                className="gallery-item"
                onClick={() => openModal(index)}
              >
                <GatsbyImage image={image.image} alt="Isometric Illustration" />
                {/* Like Button on Hover */}
                <div className="like-button-hover">
                  <LikeButton projectId={image.id} />
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
        <button onClick={closeModal} className="close-button">
          ×
        </button>
        <div className="modal-content">
          {sortedImages[currentIndex] && (
            <>
              {/* Image Section */}
              <div className="modal-image-container" onClick={toggleZoom}>
                <GatsbyImage
                  image={sortedImages[currentIndex].image}
                  alt="Enlarged Isometric Illustration"
                />
                <div className="modal-like-button">
                  <LikeButton projectId={sortedImages[currentIndex].id} />
                </div>
              </div>

              {/* Feedback Section */}
              <div className="feedback-section">
                <h3>Feedback</h3>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Share your thoughts"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <button onClick={handleAddFeedback}>Leave feedback</button>

                {/* Display Comments */}
                <div className="comments-list">
                  {comments.map((comment, idx) => (
                    <div key={idx} className="comment-item">
                      <strong>{comment.name}</strong>
                      <p>{comment.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
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
