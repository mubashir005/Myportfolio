import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faStar } from '@fortawesome/free-solid-svg-icons';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import "../styles/gallery.css";

const FeedbackSidebar = ({ images, currentIndex, handleAddFeedback }) => {
  const [isPaneOpen, setIsPaneOpen] = useState(false);
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([]);

  // Update comments when currentIndex changes
  useEffect(() => {
    const currentImageComments = images[currentIndex]?.comments || [];
    setComments(currentImageComments); // Show comments only for the current image
  }, [currentIndex, images]);

  const submitFeedback = () => {
    if (!feedback.trim() || !name.trim() || rating === 0) return;

    // Call handleAddFeedback in the parent with the current image index
    handleAddFeedback(name, feedback, rating);

    // Clear input fields
    setName("");
    setFeedback("");
    setRating(0);
  };

  const handleStarClick = (starValue) => setRating(starValue);

  return (
    <div>
      {/* Button to Open the Sliding Pane */}
      <button className="open-feedback-btn" onClick={() => setIsPaneOpen(true)}>
        <FontAwesomeIcon icon={faCommentDots} /> Leave Feedback
      </button>

      {/* Sliding Pane */}
      <SlidingPane
        isOpen={isPaneOpen}
        title="Feedback"
        subtitle="Share your thoughts with us!"
        from="right"
        width="20%"
        onRequestClose={() => setIsPaneOpen(false)}
        parentSelector={() => document.getElementById("feedback-container")} // Attach to modal container
        overlayClassName="sliding-pane-overlay"
      >
        <div className="sidebar-content">
          <div className="feedback-section">
            <h3>Feedback</h3>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              placeholder="Share your thoughts"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />

            {/* Star Rating Selection */}
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                  key={star}
                  icon={faStar}
                  onClick={() => handleStarClick(star)}
                  className={star <= rating ? "star selected" : "star"}
                />
              ))}
            </div>

            <button onClick={submitFeedback}>Leave feedback</button>
          </div>

          <div className="comments-list">
            {comments.map((comment, idx) => (
              <div key={idx} className="comment-item">
                <div className="comment-avatar">
                  {comment.name ? comment.name.charAt(0).toUpperCase() : "?"}
                </div>
                <div className="comment-content">
                  <div className="comment-name">{comment.name}</div>
                  <div className="comment-rating">
                    {"⭐".repeat(comment.rating)}
                  </div>
                  <div className="comment-text">{comment.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SlidingPane>
    </div>
  );
};

export default FeedbackSidebar;
