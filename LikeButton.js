// LikeButton.js
import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore"; // Import Firestore functions

const LikeButton = ({ projectId }) => {
  const [likeCount, setLikeCount] = useState(0);

  // Fetch the initial like count from Firestore
  // Fetch the initial like count from Firestore
  useEffect(() => {
    const fetchLikes = async () => {
      const docRef = doc(db, "projects", projectId); // Get a reference to the document
      const docSnap = await getDoc(docRef); // Fetch the document

      if (docSnap.exists()) {
        setLikeCount(docSnap.data().likes || 0); // Set the initial like count if the document exists
      } else {
        // If the document doesn't exist, create it with 0 likes
        await setDoc(docRef, { likes: 0 });
      }
    };
    fetchLikes();
  }, [projectId]);

  // Handle like button click
  const handleLike = async () => {
    const docRef = doc(db, "projects", projectId); // Get a reference to the document

    await updateDoc(docRef, {
      likes: increment(1), // Increment the like count in Firestore
    });

    setLikeCount((prevCount) => prevCount + 1); // Update UI immediately
  };

  return (
    <button onClick={handleLike} className="like-button">
      <span className="heart-icon">❤️</span>
      <span className="like-count">{likeCount}</span>
    </button>
  );
};

export default LikeButton;
