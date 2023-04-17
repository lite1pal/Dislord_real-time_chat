import React, { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import io from "socket.io-client";
import Cookies from "js-cookie";

import Main from "../Main/Main";
import Login from "../Login/Login";
import SignUp from "../SignUp/SignUp";

const apiUrl = "https://dislord-chat-app.onrender.com/";

const socket = io.connect(apiUrl);

const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  const setAuth = (boolean) => {
    setIsAuth(boolean);
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      setIsAuth(false);
    } else {
      setIsAuth(true);
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route
        path="/login"
        element={
          !isAuth ? (
            <Login setAuth={setAuth} isAuth={isAuth} apiUrl={apiUrl} />
          ) : (
            <Navigate to="/main" />
          )
        }
      />
      <Route
        path="/signup"
        element={<SignUp isAuth={isAuth} apiUrl={apiUrl} />}
      />
      <Route
        path="/main"
        element={
          !isAuth ? (
            <Navigate to="/login" />
          ) : (
            <Main
              setAuth={setAuth}
              isAuth={isAuth}
              socket={socket}
              apiUrl={apiUrl}
            />
          )
        }
      />
    </Routes>
  );
};

export default App;
