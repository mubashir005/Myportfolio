import React, { useState, useEffect } from 'react';
import '../styles/fragmented-protection.css';

const FragmentedImage = ({ src, alt, className, onClick, style }) => {
  const [fragments, setFragments] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Configuration for fragmentation
  const GRID_SIZE = 6; // 6x6 grid = 36 pieces
  const FRAGMENT_SIZE = 100 / GRID_SIZE; // Percentage per fragment

  useEffect(() => {
    if (src) {
      generateFragments();
    }
  }, [src]);

  const generateFragments = () => {
    const fragmentArray = [];
    
    // Create shuffled order to make reverse engineering harder
    const positions = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        positions.push({ row, col, id: row * GRID_SIZE + col });
      }
    }
    
    // Shuffle positions to randomize loading order
    const shuffledPositions = positions.sort(() => Math.random() - 0.5);
    
    shuffledPositions.forEach((pos, index) => {
      fragmentArray.push({
        id: pos.id,
        row: pos.row,
        col: pos.col,
        x: pos.col * FRAGMENT_SIZE,
        y: pos.row * FRAGMENT_SIZE,
        delay: index * 50, // Staggered loading
      });
    });

    setFragments(fragmentArray);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (imageError) {
    return <div className="fragment-error">Image failed to load</div>;
  }

  return (
    <div 
      className={`fragmented-image-container ${className || ''}`}
      onClick={onClick}
      style={style}
    >
      {/* Hidden original image for loading detection */}
      <img
        src={src}
        alt={alt}
        style={{ display: 'none' }}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      
      {/* Fragment grid */}
      <div className="fragment-grid">
        {fragments.map((fragment) => (
          <div
            key={fragment.id}
            className={`fragment-piece ${imageLoaded ? 'loaded' : ''}`}
            style={{
              '--fragment-x': `${fragment.x}%`,
              '--fragment-y': `${fragment.y}%`,
              '--fragment-size': `${FRAGMENT_SIZE}%`,
              '--load-delay': `${fragment.delay}ms`,
              backgroundImage: `url(${src})`,
              backgroundPosition: `-${fragment.x}% -${fragment.y}%`,
              backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
            }}
          />
        ))}
      </div>
      
      {/* Anti-screenshot overlay */}
      <div className="fragment-protection-overlay" />
      
      {/* Dynamic noise pattern */}
      <div className="fragment-noise" />
    </div>
  );
};

export default FragmentedImage;
