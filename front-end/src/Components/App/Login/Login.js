import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Navbar from "../Navbar/Navbar";
import Cookies from "js-cookie";
import { Notify } from "notiflix";

const Login = ({ setAuth, apiUrl, isAuth }) => {
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
      const remember = e.target.remember_me.checked;
      const body = { email, password, remember };
      if (!email || !password) {
        return console.log(`Email or password is not provided`);
      }

      const requestOptions = {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(body),
      };

      Notify.success("Logging...");
      const response = await fetch(`${apiUrl}/api/users/login`, requestOptions);
      const parseRes = await response.json();
      if (response.ok) {
        const token = parseRes["token"];
        const { id, username, email } = parseRes["user"];
        Cookies.set("token", token);
        Cookies.set("id", id);
        Cookies.set("username", username);
        Cookies.set("email", email);

        setTimeout(() => {
          Cookies.remove("token");
          Cookies.remove("id");
          Cookies.remove("username");
          Cookies.remove("email");
          setAuth(false);
        }, 600000);

        Notify.success("You logged in successfully");
        setAuth(true);
        redirect("/main");
      } else {
        return Notify.failure(parseRes);
      }
    } catch (error) {
      Notify.failure("Logging was failed");
      console.error(error.message);
    }
  };
  return (
    <>
      <Navbar isAuth={isAuth} route="/signup" title="Sign up" />
      <div className="flex flex-col items-center justify-center m-20 py-12 sm:px-6 lg:px-8">
        <div className="bg-white max-w-md w-full mx-auto rounded-lg shadow-lg overflow-hidden">
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-wide leading-tight py-4 border-b-4 border-blue-500">
                Login
              </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={onSubmit}>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  onChange={onChange}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  onChange={onChange}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember_me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>
                {/* <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-blue-500 hover:text-blue-400"
                  >
                    Forgot your password?
                  </a>
                </div> */}
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Log in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
