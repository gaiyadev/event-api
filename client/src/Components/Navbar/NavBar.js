import React from "react";
import { NavLink } from "react-router-dom";
import "../Navbar/NavBar.css";
import AuthContext from "../../context/auth-context";

const NavBar = () => (
  <AuthContext.Consumer>
    {(context) => {
      return (
        <header className="main-navigation">
          <div className="main-navigation_logo">
            <h1>EasyEvent</h1>
          </div>
          <nav className="main-navigation_item">
            <ul>
              <li>
                <NavLink to="/events">Events</NavLink>
              </li>

              {context.token && (
                <li>
                  <NavLink to="/bookings">Bookings</NavLink>
                </li>
              )}

              {!context.token && (
                <li>
                  <NavLink to="/auth">Authenticate</NavLink>
                </li>
              )}

              {context.token && (
                <li>
                  <button
                    onClick={context.logout}
                    type="submit"
                    className="btn"
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default NavBar;
