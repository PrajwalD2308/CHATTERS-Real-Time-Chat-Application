import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState({});

  const handelInput = (e) => {
    setInputData({
      ...inputData,
      [e.target.id]: e.target.value,
    });
  };
  console.log(inputData);
  const selectGender = (selectGender) => {
    setInputData((prev) => ({
      ...prev,
      gender: selectGender === inputData.gender ? "" : selectGender,
    }));
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (inputData.password !== inputData.confpassword) {
      setLoading(false);
      return toast.error("Password don't match");
    }
    try {
      const register = await axios.post(`/api/auth/register`, inputData, {
        withCredentials: true,
      });
      const data = register.data;
      if (data.success === false) {
        setLoading(false);
        toast.error(data.message);
        console.log(data.message);
      }
      toast.success(data?.message);
      localStorage.setItem("chatapp", JSON.stringify(data));
      setAuthUser(data);
      setLoading(false);
      navigate("/login");
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
        <h1 className="text-3xl font-bold text-center text-white mb-4">
          Register <span className="text-gray-200">Chatters</span>
        </h1>

        <form
          onSubmit={handelSubmit}
          className="flex flex-col gap-2 text-white"
        >
          {/* Full Name */}
          <div>
            <label htmlFor="fullname" className="font-semibold">
              Full Name:
            </label>
            <input
              id="fullname"
              type="text"
              onChange={handelInput}
              placeholder="Enter Full Name"
              required
              className="w-full px-4 py-2 rounded-md bg-white text-black"
            />
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="font-semibold">
              Username:
            </label>
            <input
              id="username"
              type="text"
              onChange={handelInput}
              placeholder="Enter UserName"
              required
              className="w-full input input-bordered h-10 px-4 py-2 rounded-md bg-white text-black"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="font-semibold">
              Email:
            </label>
            <input
              id="email"
              type="email"
              onChange={handelInput}
              placeholder="Enter email"
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
              placeholder="Enter password"
              required
              className="w-full input input-bordered h-10 px-4 py-2 rounded-md bg-white text-black"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confpassword" className="font-semibold">
              Confirm Password:
            </label>
            <input
              id="confpassword"
              type="password"
              onChange={handelInput}
              placeholder="Enter Confirm password"
              required
              className="w-full input input-bordered h-10 px-4 py-2 rounded-md bg-white text-black"
            />
          </div>

          {/* Gender */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                onChange={() => selectGender("male")}
                checked={inputData.gender === "male"}
                type="checkbox"
                className="mr-2"
              />
              Male
            </label>
            <label className="flex items-center">
              <input
                checked={inputData.gender === "female"}
                onChange={() => selectGender("female")}
                type="checkbox"
                className="mr-2"
              />
              Female
            </label>
          </div>

          <button
            type="submit"
            className="mt-4 w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            {loading ? "Loading..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-white">
          Don’t have an account?{" "}
          <Link
            to="/login"
            className="text-blue-300 underline hover:text-blue-500"
          >
            Login Now!!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
