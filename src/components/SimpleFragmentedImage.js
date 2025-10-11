import React, { useState, useEffect } from 'react';
import '../styles/simple-fragmented.css';

const SimpleFragmentedImage = ({ src, alt, className, onClick, style }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Configuration for visible fragmentation
  const GRID_SIZE = 4; // 4x4 grid = 16 pieces (easier to see)
  const FRAGMENT_SIZE = 100 / GRID_SIZE; // 25% per fragment

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const fragments = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      fragments.push({
        id: row * GRID_SIZE + col,
        row,
        col,
        x: col * FRAGMENT_SIZE,
        y: row * FRAGMENT_SIZE,
        delay: (row * GRID_SIZE + col) * 100, // More visible delay
      });
    }
  }

  return (
    <div 
      className={`simple-fragmented-container ${className || ''}`}
      onClick={onClick}
      style={style}
    >
      {/* Hidden original image for loading */}
      <img
        src={src}
        alt={alt}
        style={{ display: 'none' }}
        onLoad={handleImageLoad}
      />
      
      {/* Fragment grid */}
      <div className="simple-fragment-grid">
        {fragments.map((fragment) => (
          <div
            key={fragment.id}
            className={`simple-fragment-piece ${imageLoaded ? 'loaded' : ''}`}
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
      
      {/* Protection overlay */}
      <div className="simple-protection-overlay" />
    </div>
  );
};

export default SimpleFragmentedImage;
