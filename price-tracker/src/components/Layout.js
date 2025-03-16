import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import "./Layout.css";

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar" aria-label="Main Navigation">
        <h3 className="logo">Bulbeni</h3>
        <nav>
          <ul className="nav-list">
            <li>
              <Link to="/dashboard" className="nav-item">Anasayfa</Link>
            </li>
            <li>
              <Link to="/product" className="nav-item">Ürün</Link>
            </li>
            <li>
              <Link to="/price-monitor" className="nav-item">Fiyat Takip</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="content">
        <header className="top-bar">
          <Link to="/profile" className="profile-link">
            <FaUser className="nav-icon" /> Profil
          </Link>
          <span
            className="logout-icon"
            onClick={handleLogout}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleLogout()}
            aria-label="Çıkış Yap"
          >
            <FaSignOutAlt /> Çıkış Yap
          </span>
        </header>

        {/* Page Content */}
        <main className="page-content">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bottom-bar">
          <p>&copy; 2025 akb</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;