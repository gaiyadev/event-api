import React from "react";
import { NavLink } from "react-router-dom";
import '../Navbar/NavBar.css'


const NavBar =() => (
  <header className="main-navigation">
    <div className="main-navigation_logo">
      <h1>EasyEvent</h1>
    </div>
    <nav className="main-navigation_item">
      <ul>
        <li>
          <NavLink to="/events">Events</NavLink>
        </li>

        <li>
          <NavLink to="/bookings">Bookings</NavLink>
        </li>

        <li>
          <NavLink to="/auth">Authenticate</NavLink>
        </li>
      </ul>
    </nav>
  </header>
);

export default NavBar;
