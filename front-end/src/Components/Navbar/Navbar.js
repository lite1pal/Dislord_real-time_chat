import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ url, inner, isAuth, mainUser, setAuth }) => {
  const logOut = () => {
    // removes the cookies of a user after his logging out
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setAuth(false); // sets the status of authentication to false as the user got logged out
  };

  return (
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
          {mainUser["username"]}
        </span>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow">
          <Link
            to={url}
            className="block mt-4 lg:inline-block lg:mt-0 text-gray-200 hover:text-white mr-8"
          >
            {inner}
          </Link>
        </div>
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
  );
};

export default Navbar;
