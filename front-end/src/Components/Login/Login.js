import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Navbar from "../Navbar/Navbar";

const Login = ({ setAuth, isAuth }) => {
  const redirect = useNavigate();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const { email, password } = inputs;
  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = { email, password };
      if (email && password) {
        const requestOptions = {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(body),
        };
        const response = await fetch(
          "http://localhost:4001/api/users/login",
          requestOptions
        );
        if (response.ok) {
          const parseRes = await response.json();
          const token = parseRes["token"];
          const { id, username, email } = parseRes["user"];
          document.cookie = `token=${token}; path=/`;
          document.cookie = `id=${id}; path=/`;
          document.cookie = `username=${username}; path=/`;
          document.cookie = `email=${email}; path=/`;
          setAuth(true);
          redirect("/main");
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <>
      {/* <Navbar url={"/signup"} inner={"Sign Up"} isAuth={isAuth} /> */}
      <div className="SignUp">
        <h2 className="text-white font-bold text-xl mr-4">Login</h2>
        <form onSubmit={onSubmit}>
          <input
            onChange={onChange}
            type="text"
            name="email"
            placeholder="Type your email"
          />
          <input
            onChange={onChange}
            type="text"
            name="password"
            placeholder="Come up with a strong password"
          />
          <button type="submit">Log in</button>
        </form>
      </div>
    </>
  );
};

export default Login;
