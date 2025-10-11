import React, { useEffect, useState } from 'react';

const SmartProtection = () => {
  const [devToolsOpen, setDevToolsOpen] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // === DevTools Detection ===
    const detectDevTools = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      
      if (widthDiff > threshold || heightDiff > threshold) {
        setDevToolsOpen(true);
      } else {
        setDevToolsOpen(false);
      }
    };

    // === Right Click Protection ===
    const handleContextMenu = (e) => {
      e.preventDefault();
      
      // Show custom context menu instead
      setContextMenuPosition({ x: e.clientX, y: e.clientY });
      setContextMenuOpen(true);
    };

    // === Keyboard Shortcuts Protection ===
    const handleKeyDown = (e) => {
      // Disable common inspection shortcuts
      if (
        // F12
        e.keyCode === 123 ||
        // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
        // Ctrl+Shift+C
        (e.ctrlKey && e.shiftKey && e.keyCode === 67) ||
        // Ctrl+Shift+J
        (e.ctrlKey && e.shiftKey && e.keyCode === 74) ||
        // Ctrl+U (View Source)
        (e.ctrlKey && e.keyCode === 85) ||
        // Ctrl+S (Save As)
        (e.ctrlKey && e.keyCode === 83) ||
        // Ctrl+A (Select All)
        (e.ctrlKey && e.keyCode === 65) ||
        // Ctrl+P (Print)
        (e.ctrlKey && e.keyCode === 80)
      ) {
        e.preventDefault();
        return false;
      }
    };

    // === Copy/Paste Protection ===
    const handleCopy = (e) => {
      e.preventDefault();
      // Replace clipboard content
      e.clipboardData.setData('text/plain', 'Content is protected - Visit the live portfolio to view images.');
    };

    // === Click outside to close context menu ===
    const handleClick = () => {
      setContextMenuOpen(false);
    };

    // === Drag Protection ===
    const handleDragStart = (e) => {
      e.preventDefault();
      return false;
    };

    // === Fullscreen Protection ===
    const handleFullscreenChange = () => {
      if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
        // Add additional protection when in fullscreen
        document.addEventListener('keydown', handleKeyDown, { capture: true });
        document.addEventListener('contextmenu', handleContextMenu, { capture: true });
        document.addEventListener('dragstart', handleDragStart, { capture: true });
        
        // Disable printing in fullscreen
        const printProtection = (e) => {
          if (e.ctrlKey && e.keyCode === 80) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        };
        document.addEventListener('keydown', printProtection, { capture: true });
      }
    };

    // === Blur Detection (for screen sharing/recording) ===
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden - might be screen sharing
        document.title = 'Protected Portfolio - Content Hidden';
      } else {
        document.title = 'MUBASHIR UI Hassan - Portfolio';
      }
    };

    // Attach event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('click', handleClick);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    
    // DevTools detection interval
    const devToolsInterval = setInterval(detectDevTools, 500);

    // === Console Warning ===
    console.clear();
    console.log(
      '%cSTOP!',
      'color: red; font-size: 50px; font-weight: bold;'
    );
    console.log(
      '%cThis is a browser feature intended for developers. Portfolio content is protected.',
      'color: red; font-size: 16px;'
    );
    
    // === Add CSS to blur content when DevTools are open ===
    const style = document.createElement('style');
    style.textContent = `
      .devtools-blur {
        filter: blur(5px);
        pointer-events: none;
      }
      /* Additional fullscreen protection */
      .protected-fullscreen-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: transparent;
        pointer-events: none;
        z-index: 999;
      }
    `;
    document.head.appendChild(style);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      clearInterval(devToolsInterval);
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  // Apply blur effect when DevTools are detected
  useEffect(() => {
    const galleryContainer = document.querySelector('.gallery-container');
    const modalContent = document.querySelector('.modal-content');
    
    if (devToolsOpen) {
      if (galleryContainer) galleryContainer.classList.add('devtools-blur');
      if (modalContent) modalContent.classList.add('devtools-blur');
    } else {
      if (galleryContainer) galleryContainer.classList.remove('devtools-blur');
      if (modalContent) modalContent.classList.remove('devtools-blur');
    }
  }, [devToolsOpen]);

  return (
    <>
      {/* DevTools Detection Warning */}
      {devToolsOpen && (
        <div className="devtools-warning active">
          <div>
            <h2>⚠️ Developer Tools Detected</h2>
            <p>Please close developer tools to view the portfolio content.</p>
            <p>This portfolio is protected against unauthorized access.</p>
          </div>
        </div>
      )}

      {/* Custom Context Menu */}
      {contextMenuOpen && (
        <div 
          className="custom-context-menu"
          style={{
            left: `${contextMenuPosition.x}px`,
            top: `${contextMenuPosition.y}px`
          }}
        >
          <div className="custom-context-menu-item">
            📧 Contact for Licensing
          </div>
          <div className="custom-context-menu-item">
            🌐 Visit Live Portfolio
          </div>
          <div className="custom-context-menu-item">
            ⚖️ Copyright Protected
          </div>
        </div>
      )}

      {/* Hidden Copyright Notices */}
      <div className="hidden-copyright">
        © 2025 Mubashir UI Hassan. All rights reserved. 
        Unauthorized use, reproduction, or distribution prohibited.
        Portfolio images are protected by copyright law.
        Contact: mubashir.ui.hassan@email.com
      </div>

      {/* SEO Protection - Hidden content for crawlers */}
      <div className="seo-protection">
        protected portfolio copyright mubashir ui hassan original work
        unauthorized reproduction prohibited licensing available
        portfolio images protected by copyright law
      </div>
    </>
  );
};

export default SmartProtection;
