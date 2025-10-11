import { useEffect } from 'react';

const useAdvancedProtection = () => {
  useEffect(() => {
    // Detect screen recording software
    const detectScreenRecording = () => {
      let isRecording = false;
      
      // Check for common screen recording indicators
      const checkRecording = () => {
        // Check if getDisplayMedia is being used
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
          navigator.mediaDevices.getDisplayMedia = function(...args) {
            isRecording = true;
            console.warn('Screen recording detected!');
            // Optionally blur content or show warning
            document.body.style.filter = 'blur(10px)';
            return originalGetDisplayMedia.apply(this, args);
          };
        }
      };
      
      checkRecording();
    };

    // Disable print screen key
    const disablePrintScreen = (e) => {
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        navigator.clipboard.writeText('');
        console.warn('Print Screen disabled');
      }
    };

    // Detect DevTools more aggressively
    let devToolsOpen = false;
    const detectDevTools = () => {
      const threshold = 160;
      let opened = false;
      
      const checkDevTools = () => {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
          if (!opened) {
            opened = true;
            devToolsOpen = true;
            // Add strong blur and warning
            document.body.style.filter = 'blur(15px) brightness(0.3)';
            document.body.style.userSelect = 'none';
            document.body.style.pointerEvents = 'none';
            
            // Create warning overlay
            const warning = document.createElement('div');
            warning.id = 'devtools-warning';
            warning.innerHTML = `
              <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.95);
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                font-size: 24px;
                z-index: 99999;
                text-align: center;
                font-family: Arial, sans-serif;
              ">
                <div style="max-width: 600px; padding: 40px;">
                  <h1 style="color: #ff4444; margin-bottom: 20px;">🔒 CONTENT PROTECTED</h1>
                  <p style="margin-bottom: 20px;">Developer tools detected. This content is protected by copyright.</p>
                  <p style="margin-bottom: 20px;">Portfolio by: <strong>Mubashir UI Hassan</strong></p>
                  <p style="font-size: 16px; opacity: 0.8;">Please close developer tools to continue browsing.</p>
                  <p style="font-size: 14px; opacity: 0.6; margin-top: 30px;">Unauthorized copying or extraction of content is prohibited.</p>
                </div>
              </div>
            `;
            document.body.appendChild(warning);
          }
        } else {
          if (opened) {
            opened = false;
            devToolsOpen = false;
            document.body.style.filter = 'none';
            document.body.style.userSelect = '';
            document.body.style.pointerEvents = '';
            
            const warning = document.getElementById('devtools-warning');
            if (warning) {
              warning.remove();
            }
          }
        }
      };
      
      setInterval(checkDevTools, 100);
    };

    // Disable common inspection methods
    const disableInspection = () => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, etc.
      const disabledKeys = ['F12', 'I', 'J', 'U', 'S', 'A', 'C', 'V', 'X', 'P'];
      
      document.addEventListener('keydown', (e) => {
        if (
          disabledKeys.includes(e.key) ||
          (e.ctrlKey && e.shiftKey && disabledKeys.includes(e.key.toUpperCase())) ||
          (e.ctrlKey && disabledKeys.includes(e.key.toUpperCase())) ||
          e.key === 'F12'
        ) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      });
    };

    // Add invisible copyright to images
    const addInvisibleCopyright = () => {
      const addCopyrightToImage = (img) => {
        if (!img.dataset.copyrighted) {
          // Add invisible copyright in image metadata (when possible)
          img.title = '© 2025 Mubashir UI Hassan - All Rights Reserved';
          img.dataset.copyrighted = 'true';
          
          // Prevent drag and context menu
          img.addEventListener('dragstart', (e) => e.preventDefault());
          img.addEventListener('contextmenu', (e) => e.preventDefault());
          img.addEventListener('selectstart', (e) => e.preventDefault());
        }
      };

      // Apply to existing images
      document.querySelectorAll('img').forEach(addCopyrightToImage);
      
      // Observer for new images
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeName === 'IMG') {
              addCopyrightToImage(node);
            } else if (node.querySelectorAll) {
              node.querySelectorAll('img').forEach(addCopyrightToImage);
            }
          });
        });
      });
      
      observer.observe(document.body, { childList: true, subtree: true });
    };

    // Watermark injection
    const injectWatermarks = () => {
      const watermarkText = '© Mubashir UI Hassan';
      const style = document.createElement('style');
      style.textContent = `
        .gatsby-image-wrapper::after {
          content: '${watermarkText}';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          color: rgba(255, 255, 255, 0.1);
          font-size: 14px;
          font-weight: bold;
          pointer-events: none;
          z-index: 10;
          user-select: none;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .gallery-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 30px,
            rgba(255, 255, 255, 0.02) 30px,
            rgba(255, 255, 255, 0.02) 32px
          );
          pointer-events: none;
          z-index: 1;
        }
      `;
      document.head.appendChild(style);
    };

    // Initialize all protections
    detectScreenRecording();
    detectDevTools();
    disableInspection();
    addInvisibleCopyright();
    injectWatermarks();
    
    // Add print screen detection
    document.addEventListener('keydown', disablePrintScreen);
    document.addEventListener('keyup', disablePrintScreen);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', disablePrintScreen);
      document.removeEventListener('keyup', disablePrintScreen);
    };
  }, []);
};

export default useAdvancedProtection;
