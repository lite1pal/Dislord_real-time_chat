import React, { useState } from "react";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { Notify } from "notiflix/build/notiflix-notify-aio";

const SignUp = ({ apiUrl, isAuth }) => {
  const redirect = useNavigate();
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    age: "",
    password: "",
  });
  const { username, email, age, password } = inputs;
  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = { username, email, age, password };
      if (!username || !email || !age || !password) {
        return Notify.failure("All fields are required", {
          position: "left-bottom",
        });
      }

      if (age <= 0) {
        return Notify.failure("Age has to be higher than 0");
      }

      const requestOptions = {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(body),
      };
      const response = await fetch(
        `${apiUrl}/api/users/signup`,
        requestOptions
      );
      if (response.ok) {
        const parseRes = await response.json();
        // document.cookie = `token=${parseRes}; path=/`;
        console.log(parseRes);
        redirect("/login");
      } else {
        const parseRes = await response.json();
        console.log(parseRes);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <Navbar isAuth={isAuth} route="/login" title="Log in" />
      <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Sign up
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            <input
              onChange={onChange}
              type="text"
              name="username"
              placeholder="Username"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            />
            <input
              onChange={onChange}
              type="email"
              name="email"
              placeholder="Email"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            />
            <input
              onChange={onChange}
              type="text"
              name="age"
              placeholder="Age"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            />
            <input
              onChange={onChange}
              type="password"
              name="password"
              placeholder="Password"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            />
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign up
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
