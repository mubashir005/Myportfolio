import React from "react";
import { Link } from "gatsby";

const Header = () => (
  <header style={{ padding: "1rem", textAlign: "center", background: "#333", color: "#fff" }}>
    <h1><Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Mubashir's Portfolio</Link></h1>
  </header>
);

export default Header;
