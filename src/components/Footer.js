import React from "react";

const Footer = () => (
  <footer style={{ padding: "1rem", textAlign: "center", background: "#333", color: "#fff", marginTop: "2rem" }}>
    <p>© {new Date().getFullYear()} Mubashir Ul Hassan | Connect on <a href="https://www.linkedin.com/in/your-profile" target="_blank" style={{ color: "#fff" }}>LinkedIn</a></p>
  </footer>
);

export default Footer;
