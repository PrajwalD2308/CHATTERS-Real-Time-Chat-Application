// import axios from "axios";
import axios from "../utils/axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();

  const [userInput, setUserInput] = useState({});
  const [loading, setLoading] = useState(false);

  const handelInput = (e) => {
    setUserInput({
      ...userInput,
      [e.target.id]: e.target.value,
    });
  };

  console.log(userInput);

  const handelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const login = await axios.post(`/api/auth/login`, userInput, {
        withCredentials: true,
      });
      const data = login.data;
      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
      }
      toast.success(data.message);
      localStorage.setItem("chatapp", JSON.stringify(data));
      setAuthUser(data);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/your-bg-image-path.jpg')",
      }}
    >
      <div className="w-full max-w-md p-6 rounded-xl shadow-lg bg-white/10 backdrop-blur-md">
        <h1 className="text-3xl font-bold text-center text-gray-300 mb-4">
          Login <span className="text-gray-950">Chatters</span>
        </h1>

        <form
          onSubmit={handelSubmit}
          className="flex flex-col gap-2 text-white"
        >
          {/* Email */}
          <div>
            <label htmlFor="username" className="font-semibold">
              Email:
            </label>
            <input
              id="email"
              type="email"
              onChange={handelInput}
              placeholder="Enter your email"
              required
              className="w-full input input-bordered h-10 px-4 py-2 rounded-md bg-white text-black"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="font-semibold">
              Password:
            </label>
            <input
              id="password"
              type="password"
              onChange={handelInput}
              placeholder="Enter Password"
              required
              className="w-full input input-bordered h-10 px-4 py-2 rounded-md bg-white text-black"
            />
          </div>

          <button
            type="submit"
            className="mt-4 self-center w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-white">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-300 underline hover:text-blue-500"
          >
            Register Now!!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
