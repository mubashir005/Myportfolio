module.exports = {
  siteMetadata: {
    title: "My Portfolio",
    description: "A collection of isometric illustrations.",
    author: "@yourusername",
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images/`, // Ensure this path is correct
      },
    },
  ],
};