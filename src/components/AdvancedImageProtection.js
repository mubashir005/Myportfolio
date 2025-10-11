import React, { useState, useEffect } from 'react';
import FragmentedImage from './FragmentedImage';

const AdvancedImageProtection = ({ src, alt, className, onClick, style, protectionLevel = 'high' }) => {
  const [useFragmentation, setUseFragmentation] = useState(false);
  const [isReverseEngineDetected, setIsReverseEngineDetected] = useState(false);

  useEffect(() => {
    // Detect potential reverse image search attempts
    const detectReverseEngineAttempts = () => {
      // Check for common reverse search user agents
      const userAgent = navigator.userAgent.toLowerCase();
      const reverseEnginePatterns = [
        'googlebot', 'bingbot', 'slurp', 'facebookexternalhit',
        'twitterbot', 'linkedinbot', 'pinterestbot', 'crawler',
        'spider', 'scraper', 'bot', 'automated'
      ];
      
      const isBot = reverseEnginePatterns.some(pattern => 
        userAgent.includes(pattern)
      );

      // Check for automated screenshot tools
      const hasAutomationFlags = 
        window.navigator.webdriver ||
        window.__nightmare ||
        window._phantom ||
        window.callPhantom ||
        window.__fxdriver_unwrapped ||
        window.Buffer ||
        window.emit ||
        window.spawn ||
        document.$cdc_asdjflasutopfhvcZLmcfl_ ||
        document.documentElement.hasAttribute('webdriver') ||
        navigator.webdriver;

      // Check for headless browser
      const isHeadless = 
        /HeadlessChrome/.test(navigator.userAgent) ||
        navigator.plugins.length === 0 ||
        !navigator.languages ||
        navigator.languages.length === 0;

      return isBot || hasAutomationFlags || isHeadless;
    };

    // Advanced detection techniques
    const runAdvancedDetection = () => {
      // Canvas fingerprinting detection
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Fragmentation test', 2, 2);
      const canvasFingerprint = canvas.toDataURL();
      
      // Check for common automation fingerprints
      const isAutomated = 
        canvasFingerprint === 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==' ||
        window.outerWidth === 0 ||
        window.outerHeight === 0;

      return isAutomated;
    };

    const shouldUseFragmentation = () => {
      switch (protectionLevel) {
        case 'maximum':
          return true;
        case 'high':
          return detectReverseEngineAttempts() || runAdvancedDetection();
        case 'medium':
          return detectReverseEngineAttempts();
        case 'low':
          return false;
        default:
          return detectReverseEngineAttempts();
      }
    };

    const detected = detectReverseEngineAttempts() || runAdvancedDetection();
    setIsReverseEngineDetected(detected);
    setUseFragmentation(shouldUseFragmentation());

    // Dynamic switching based on user behavior
    const handleSuspiciousActivity = () => {
      let suspiciousScore = 0;
      
      // Check for rapid right-clicks
      let rightClickCount = 0;
      document.addEventListener('contextmenu', () => {
        rightClickCount++;
        if (rightClickCount > 3) suspiciousScore += 2;
      });

      // Check for suspicious key combinations
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey && e.shiftKey) || e.key === 'F12') {
          suspiciousScore += 3;
        }
      });

      // Check for drag attempts
      document.addEventListener('dragstart', () => {
        suspiciousScore += 2;
      });

      // If suspicious score is high, enable maximum protection
      if (suspiciousScore > 5) {
        setUseFragmentation(true);
      }
    };

    handleSuspiciousActivity();
  }, [protectionLevel]);

  // Render fragmented image if protection is enabled
  if (useFragmentation) {
    return (
      <FragmentedImage 
        src={src}
        alt={alt}
        className={`${className || ''} ${isReverseEngineDetected ? 'bot-detected' : ''}`}
        onClick={onClick}
        style={style}
      />
    );
  }

  // Render regular image with basic protection
  return (
    <div className={`regular-protected-image ${className || ''}`} style={style}>
      <img 
        src={src} 
        alt={alt} 
        onClick={onClick}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          userSelect: 'none',
          pointerEvents: onClick ? 'auto' : 'none'
        }}
      />
      {/* Basic protection overlay */}
      <div 
        className="basic-protection-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'repeating-linear-gradient(43deg, transparent 0px, transparent 48px, rgba(255,255,255,0.02) 48px, rgba(255,255,255,0.02) 49px)',
          opacity: 0.3,
          pointerEvents: 'none',
          zIndex: 2
        }}
      />
    </div>
  );
};

export default AdvancedImageProtection;
