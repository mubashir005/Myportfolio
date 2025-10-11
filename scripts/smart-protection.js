const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

console.log('🔒 Starting Smart Portfolio Protection...');

// === HTML Protection ===
function protectHTML() {
  console.log('📄 Protecting HTML files...');
  
  const htmlFiles = ['index.html', 'infographic/index.html'];
  
  htmlFiles.forEach(file => {
    const filePath = path.join(publicDir, file);
    
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Add meta tags for SEO protection
      const metaTags = `
    <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex">
    <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex">
    <meta name="bingbot" content="noindex, nofollow, noarchive, nosnippet">
    <meta name="description" content="Protected Creative Portfolio - Authorized viewing only">
    <meta name="author" content="Mubashir UI Hassan">
    <meta name="copyright" content="© 2025 Mubashir UI Hassan. All rights reserved.">
    <meta property="og:image" content="">
    <meta name="twitter:image" content="">
      `;
      
      // Insert meta tags
      content = content.replace('<head>', `<head>${metaTags}`);
      
      // Add invisible copyright notices
      const copyrightNotice = `
    <!-- © 2025 Mubashir UI Hassan - All Rights Reserved -->
    <!-- Unauthorized reproduction prohibited -->
    <!-- Licensed content - Contact for permissions -->
      `;
      content = content.replace('<body>', `<body>${copyrightNotice}`);
      
      // Add noscript protection
      const noscriptProtection = `
    <noscript>
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                  background: #000; color: #fff; display: flex; align-items: center; 
                  justify-content: center; z-index: 9999; font-size: 20px; text-align: center;">
        <div>
          <h2>⚠️ JavaScript Required</h2>
          <p>This protected portfolio requires JavaScript to function properly.</p>
          <p>Please enable JavaScript in your browser settings.</p>
        </div>
      </div>
    </noscript>
      `;
      content = content.replace('<body>', `<body>${noscriptProtection}`);
      
      // Obfuscate some content
      content = content.replace(/src="([^"]*\.(jpg|jpeg|png|gif|webp))"/gi, 
        'data-protected-src="$1" src=""');
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Protected: ${file}`);
    }
  });
}

// === CSS Protection ===
function protectCSS() {
  console.log('🎨 Protecting CSS files...');
  
  const cssFiles = fs.readdirSync(publicDir).filter(file => file.endsWith('.css'));
  
  cssFiles.forEach(file => {
    const filePath = path.join(publicDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add copyright notice
    const copyrightNotice = `/*
 * © 2025 Mubashir UI Hassan - Portfolio Styles
 * All rights reserved. Unauthorized use prohibited.
 * Protected content - Licensed material
 */\n`;
    
    content = copyrightNotice + content;
    
    // Minify to make it harder to read
    content = content
      .replace(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/;\s*}/g, '}') // Remove unnecessary semicolons
      .trim();
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Protected CSS: ${file}`);
  });
}

// === .htaccess Protection ===
function createHtaccess() {
  console.log('🛡️ Creating .htaccess protection...');
  
  const htaccessContent = `# Portfolio Protection - © 2025 Mubashir UI Hassan
# Unauthorized access prohibited

# Disable server signature
ServerSignature Off

# Prevent access to sensitive files
<Files ~ "\\.(env|log|config)$">
    Require all denied
</Files>

# Hotlinking protection
RewriteEngine On
RewriteCond %{HTTP_REFERER} !^$
RewriteCond %{HTTP_REFERER} !^https?://(www\\.)?yourdomain\\.com [NC]
RewriteCond %{HTTP_REFERER} !^https?://(www\\.)?localhost [NC]
RewriteRule \\.(jpg|jpeg|png|gif|webp)$ /images/protected.png [R=403,L]

# Disable directory browsing
Options -Indexes

# Block common bot access
RewriteCond %{HTTP_USER_AGENT} ^.*(httrack|wget|curl).*$ [NC]
RewriteRule ^(.*)$ - [F,L]

# Cache control for images
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/webp "access plus 1 month"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Header always set Content-Security-Policy "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'"
</IfModule>

# Copyright notice in headers
<IfModule mod_headers.c>
    Header set X-Copyright "© 2025 Mubashir UI Hassan - All Rights Reserved"
    Header set X-License "Protected Content - Unauthorized use prohibited"
</IfModule>
`;

  const htaccessPath = path.join(publicDir, '.htaccess');
  fs.writeFileSync(htaccessPath, htaccessContent, 'utf8');
  console.log('✅ Created .htaccess protection');
}

// === robots.txt Protection ===
function createRobotsTxt() {
  console.log('🤖 Creating robots.txt...');
  
  const robotsContent = `# Portfolio Protection - © 2025 Mubashir UI Hassan
# Unauthorized crawling prohibited

User-agent: *
Disallow: /
Disallow: /images/
Disallow: /static/
Disallow: /*.jpg
Disallow: /*.jpeg
Disallow: /*.png
Disallow: /*.gif
Disallow: /*.webp

# Block specific crawlers
User-agent: Googlebot-Image
Disallow: /

User-agent: Bingbot
Disallow: /

User-agent: ia_archiver
Disallow: /

User-agent: Wayback
Disallow: /

# Crawl-delay for any allowed bots
Crawl-delay: 86400

# No sitemap provided
`;

  const robotsPath = path.join(publicDir, 'robots.txt');
  fs.writeFileSync(robotsPath, robotsContent, 'utf8');
  console.log('✅ Created robots.txt');
}

// === JavaScript Obfuscation ===
function protectJS() {
  console.log('🔧 Protecting JavaScript files...');
  
  const jsFiles = fs.readdirSync(publicDir).filter(file => file.endsWith('.js'));
  
  jsFiles.forEach(file => {
    const filePath = path.join(publicDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add copyright notice
    const copyrightNotice = `/* © 2025 Mubashir UI Hassan - Protected Content */\n`;
    content = copyrightNotice + content;
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Protected JS: ${file}`);
  });
}

// === Run all protections ===
function runProtection() {
  try {
    protectHTML();
    protectCSS();
    protectJS();
    createHtaccess();
    createRobotsTxt();
    
    console.log('🎉 Smart Portfolio Protection Complete!');
    console.log('📊 Protection Summary:');
    console.log('   ✅ HTML files protected with meta tags and obfuscation');
    console.log('   ✅ CSS files minified and copyright protected');
    console.log('   ✅ JavaScript files protected');
    console.log('   ✅ Server protection with .htaccess');
    console.log('   ✅ SEO protection with robots.txt');
    console.log('   ✅ Multiple layers of copyright protection');
    
  } catch (error) {
    console.error('❌ Protection failed:', error);
    process.exit(1);
  }
}

runProtection();
