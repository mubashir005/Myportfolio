import React, { useEffect } from 'react';

const ImageProtection = () => {
  useEffect(() => {
    // Wait for images to load before applying protection
    const timer = setTimeout(() => {
      console.log('Images should be loaded, applying basic protection...');
      
      // Only apply basic right-click protection after images are loaded
      const disableRightClick = (e) => {
        if (e.target.tagName === 'IMG') {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      };

      document.addEventListener('contextmenu', disableRightClick);
      
      // Cleanup function for the event listener
      return () => {
        document.removeEventListener('contextmenu', disableRightClick);
      };
    }, 3000); // Wait 3 seconds for images to load
    
    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything visible
};

export default ImageProtection;
