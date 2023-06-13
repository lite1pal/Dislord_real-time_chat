import React from "react";
import { Link, Navigate } from "react-router-dom";
import "./Navbar.css";
import Cookies from "js-cookie";

const Navbar = ({ mainUser, setAuth, isAuth, route, title }) => {
  const logOut = () => {
    // removes the cookies of a user after his logging out
    Cookies.remove("token");
    Cookies.remove("id");
    Cookies.remove("username");
    Cookies.remove("email");
    setAuth(false); // sets the status of authentication to false as the user got logged out
  };

  return (
    <>
      {isAuth ? (
        <nav className="Navbar">
          <div className="navbar-logo"></div>
          <div className="navbar-links">
            <ul>
              <li></li>
              <li>
                <button onClick={logOut}>Log Out</button>
              </li>
              <li className="hidden">
                <button>Friends</button>
              </li>
            </ul>
          </div>
          <div className="navbar-profile">
            <img width="75" height="75" src={Cookies.get("avatar_url")} />
            <span>{mainUser["username"] ? mainUser["username"] : ""}</span>
          </div>
        </nav>
      ) : (
        <nav className="Navbar">
          <div className="navbar-logo"></div>
          <ul>
            <li>
              <Link to={route}>{title}</Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default Navbar;
