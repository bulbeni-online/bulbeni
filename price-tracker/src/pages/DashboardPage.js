// src/pages/DashboardPage.js
import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

const DashboardPage = () => {
  const username = localStorage.getItem("user") || "Misafir";

  return (
    <div style={styles.container}>
      <h2>Dashboard</h2>
      <p>Hoş geldiniz, {username}! Burada bilgilerinizi görebilirsiniz.</p>
      
      {/* Add URL link */}
      <div style={styles.linkContainer}>
        <Link to="/add-url" style={styles.link}>URL Ekle</Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "400px",
    margin: "100px auto",
    textAlign: "center",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  linkContainer: {
    marginTop: "20px",
  },
  link: {
    textDecoration: "none",
    color: "#007bff",
    fontSize: "16px",
    fontWeight: "bold",
  },
};

export default DashboardPage;
