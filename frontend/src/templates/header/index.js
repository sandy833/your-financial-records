import React from "react";
import "./header.css";
import { NavLink } from "react-router-dom";

const Header = (props) => {
  return (
    <header className="header">
      <div className="menu">
        <NavLink exact activeClassName="active" to="/">
          Home
        </NavLink>
        <NavLink activeClassName="active" to="/login">
          Login
        </NavLink>
        <small>(Access without token only)</small>
        <NavLink activeClassName="active" to="/dashboard">
          Dashboard
        </NavLink>
        <small>(Access with token only)</small>
      </div>
    </header>
  );
};

export default Header;
