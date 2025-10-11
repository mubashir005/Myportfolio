import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

const LikeButton = ({ projectId }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch the initial like count from Firestore
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const docRef = doc(db, "infographics", projectId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setLikeCount(docSnap.data().likes || 0);
        } else {
          await setDoc(docRef, { likes: 0 });
        }
      } catch (error) {
        console.error("Error fetching likes: ", error);
      }
    };

    fetchLikes();
  }, [projectId]);

  // Handle like button click
  const handleLike = async (event) => {
    event.stopPropagation();
    if (loading) return; // Prevent double-clicks

    setLoading(true);

    try {
      const docRef = doc(db, "infographics", projectId);

      await updateDoc(docRef, {
        likes: increment(1),
      });

      setLikeCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error("Error updating like count: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleLike} className="like-button" disabled={loading}>
      <span className="heart-icon">❤️</span>
      <span className="like-count">{likeCount}</span>
    </button>
  );
};

export default LikeButton;
