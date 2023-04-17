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
        <nav className="flex items-center justify-between flex-wrap bg-gray-700 p-4 md:p-6">
          <div className="flex items-center flex-shrink-0 text-white mr-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-8 h-8"
            >
              <path
                fillRule="evenodd"
                d="M2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm6.293 6.293a1 1 0 011.414 0L10 11.586l1.293-1.293a1 1 0 011.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-semibold text-xl tracking-tight ml-2">
              {mainUser["username"] ? mainUser["username"] : ""}
            </span>
          </div>
          <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
            <div>
              <button
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2.5  px-4 border border-gray-400 rounded shadow"
                onClick={logOut}
              >
                Log Out
              </button>
            </div>
          </div>
        </nav>
      ) : (
        <nav className="flex justify-between items-center bg-gray-700 py-4 px-6">
          <div className="text-white font-bold text-xl">Dislord</div>
          <ul className="flex space-x-4 text-white">
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
