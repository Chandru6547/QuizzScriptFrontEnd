import React from "react";
import "./Header.css";
import img from './image_1.jpg';

const Header = () => {
  return (
    <header className="header">
        <ul className="nav-links">
          <li>HOME</li>
          <li>ABOUT</li>
          <li>EXPERIENCE</li>
          <li>WORK</li>
          <li>CONTACT</li>
        </ul>
    </header>
  );
};

export default Header;
