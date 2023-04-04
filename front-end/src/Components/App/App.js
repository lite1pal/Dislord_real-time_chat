import React, { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import io from "socket.io-client";

import Main from "../Main/Main";
import Login from "../Login/Login";
import SignUp from "../SignUp/SignUp";

const socket = io.connect("http://localhost:4001");

const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  const setAuth = (boolean) => {
    setIsAuth(boolean);
  };

  useEffect(() => {
    const token = document.cookie.slice(6, -8);
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
            <Login setAuth={setAuth} isAuth={isAuth} />
          ) : (
            <Navigate to="/main" />
          )
        }
      />
      <Route path="/signup" element={<SignUp isAuth={isAuth} />} />
      <Route
        path="/main"
        element={
          !isAuth ? (
            <Navigate to="/login" />
          ) : (
            <Main setAuth={setAuth} isAuth={isAuth} socket={socket} />
          )
        }
      />
    </Routes>
  );
};

export default App;
