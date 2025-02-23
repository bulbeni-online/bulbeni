// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Component }) => {
  const token = localStorage.getItem("token"); // Check for token

  if (!token) {
    // Trigger alert when the user is not authenticated
    alert("You must be logged in to access this page!");
  }

  return token ? <Component /> : <Navigate to="/" />; // Redirect if no token
};

export default PrivateRoute;


