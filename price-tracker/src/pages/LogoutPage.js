// src/pages/LogoutPage.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the token or any user authentication data from localStorage or sessionStorage
    localStorage.removeItem("token"); // Remove token from localStorage (or sessionStorage)
    sessionStorage.removeItem("user"); // Remove user data (optional)

    // Redirect to the login page after logout
    navigate("/");
  }, [navigate]);

  return (
    <div>
      <h2>Logging out...</h2>
    </div>
  );
};

export default LogoutPage;
