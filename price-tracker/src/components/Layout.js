// src/components/Layout.js
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa"; // For the logout icon

const Layout = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token from local storage
    navigate("/"); // Redirect to login page
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h3 style={styles.logo}>MyApp</h3>
        <nav>
          <ul style={styles.navList}>
            <li>
              <Link to="/dashboard" style={styles.navItem}>Dashboard</Link>
            </li>
            <li>
              <Link to="/add-url" style={styles.navItem}>Add URL</Link>
            </li>
            <li>
              <Link to="/price-monitor" style={styles.navItem}>Monitor Prices</Link>
            </li>
            {/* Add more links as needed */}
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div style={styles.content}>
        <div style={styles.topBar}>
          <span style={styles.logoutIcon} onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </span>
        </div>

        {/* Page Content */}
        <div style={styles.pageContent}>
          <Outlet /> {/* This will render the child pages */}
        </div>

        {/* Bottom Bar (Info Section) */}
        <div style={styles.bottomBar}>
          <p>Some informational text goes here...</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
  },
  sidebar: {
    width: "250px",
    background: "#2c3e50",
    color: "white",
    height: "100vh",
    paddingTop: "20px",
    position: "fixed",
  },
  logo: {
    color: "#ecf0f1",
    textAlign: "center",
    marginBottom: "30px",
  },
  navList: {
    listStyleType: "none",
    padding: "0",
  },
  navItem: {
    color: "#ecf0f1",
    textDecoration: "none",
    display: "block",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    transition: "background-color 0.3s",
  },
  navItemHover: {
    backgroundColor: "#34495e",
  },
  content: {
    marginLeft: "250px",
    width: "calc(100% - 250px)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  topBar: {
    background: "#34495e",
    color: "white",
    padding: "10px",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  logoutIcon: {
    cursor: "pointer",
    fontSize: "20px",
  },
  pageContent: {
    flex: 1,
    padding: "20px",
    background: "#ecf0f1",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  bottomBar: {
    background: "#34495e",
    color: "white",
    padding: "10px",
    textAlign: "center",
  },
};

export default Layout;
