import React from "react";
import "./footer.css";

const Footer = (props) => {
  return (
    <footer className="footer">
      <p>Crafted with love in Pacitan &copy; {new Date().getFullYear()}</p>
    </footer>
  );
};

export default Footer;
