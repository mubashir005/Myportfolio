module.exports = {
  siteMetadata: {
    title: "My Portfolio",
    description: "A collection of isometric illustrations.",
    author: "@yourusername",
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          formats: [`auto`, `webp`, `avif`],  
          quality: 90,                      
          placeholder: `blurred`,           
          backgroundColor: `transparent`,   
          breakpoints: [750, 1080, 1366, 1920], 
        },
        failOnError: true,                  
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `infograph_images`,
        path: `${__dirname}/src/infographic_images/`,
      },
    },
  ],
};
