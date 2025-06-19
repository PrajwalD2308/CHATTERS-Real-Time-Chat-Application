import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// import { useEffect, useState } from "react";
// import axios from "axios";

export const VerifyUser = () => {
  const { authUser } = useAuth();
  return authUser ? <Outlet /> : <Navigate to={"/login"} />;
  // const navigate = useNavigate();
  // const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //     const checkUser = async () => {
  //       try {
  //         await axios.get("/api/user/me", { withCredentials: true });
  //         setLoading(false); // User is authenticated
  //       } catch (error) {
  //         navigate("/login"); // Not authenticated, redirect to login
  //       }
  //     };

  //     checkUser();
  //   }, [navigate]);

  //   if (loading) return <div>Loading...</div>;

  //   return <Outlet />;
};
