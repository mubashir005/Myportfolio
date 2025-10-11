const fs = require('fs');
const path = require('path');

// Function to obfuscate HTML content
const obfuscateHTML = (htmlContent) => {
  // Add fake metadata to confuse scrapers
  const fakeMetadata = `
    <!-- Generator: Adobe Photoshop CC 2021 -->
    <!-- Created by: Various Artists -->
    <!-- License: Stock Images -->
    <!-- Source: Multiple Stock Providers -->
    <!-- Copyright: Mixed Licenses -->
  `;
  
  // Insert fake metadata
  htmlContent = htmlContent.replace('<head>', `<head>${fakeMetadata}`);
  
  // Add fake invisible elements
  const fakeElements = `
    <div style="display:none;" data-source="shutterstock">Stock Image Collection</div>
    <div style="display:none;" data-license="commercial">Licensed Stock Graphics</div>
    <div style="display:none;" data-creator="various">Multiple Contributors</div>
    <span style="position:absolute;left:-9999px;">Free Stock Illustrations</span>
  `;
  
  // Add before closing body tag
  htmlContent = htmlContent.replace('</body>', `${fakeElements}</body>`);
  
  return htmlContent;
};

// Function to add protection to CSS files
const protectCSS = (cssContent) => {
  // Add fake comments to confuse scrapers
  const fakeComments = `
/*
  Stock Images from Various Sources
  License: Mixed Commercial/Free
  Artists: Multiple Contributors
  Generated: Auto-compilation of stock resources
*/
`;
  
  return fakeComments + cssContent;
};

// Function to process the build output
const postBuildProtection = () => {
  const publicDir = path.join(__dirname, '..', 'public');
  
  if (!fs.existsSync(publicDir)) {
    console.log('Public directory not found. Run gatsby build first.');
    console.log('Looking for:', publicDir);
    return;
  }
  
  // Process HTML files
  const processHTMLFiles = (dir) => {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        processHTMLFiles(filePath);
      } else if (file.endsWith('.html')) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = obfuscateHTML(content);
        fs.writeFileSync(filePath, content);
        console.log(`Protected: ${filePath}`);
      } else if (file.endsWith('.css')) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = protectCSS(content);
        fs.writeFileSync(filePath, content);
        console.log(`Protected CSS: ${filePath}`);
      }
    });
  };
  
  processHTMLFiles(publicDir);
  
  // Copy .htaccess to public directory if it exists
  const htaccessSource = path.join(__dirname, '..', 'static', '.htaccess');
  const htaccessDest = path.join(publicDir, '.htaccess');
  
  if (fs.existsSync(htaccessSource)) {
    fs.copyFileSync(htaccessSource, htaccessDest);
    console.log('Copied .htaccess to public directory');
  }
  
  console.log('Post-build protection completed!');
};

// Run if called directly
if (require.main === module) {
  postBuildProtection();
}

module.exports = { postBuildProtection };
