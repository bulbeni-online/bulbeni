import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaKey, FaIdCard, FaUserCog } from "react-icons/fa";
import "./Layout.css";

const Layout = () => {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  // Close popup when clicking outside and reset button state
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isPopupOpen &&
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsPopupOpen(false);
        buttonRef.current.blur(); // Remove focus from button
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupOpen]);

  const handleMouseLeave = () => {
    setIsPopupOpen(false);
    buttonRef.current.blur(); // Remove focus when mouse leaves
  };

  const username = localStorage.getItem("user") || "Misafir";

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
          <div className="account-container">
            <button
              ref={buttonRef}
              className={`account-button ${isPopupOpen ? "active" : ""}`} // Dynamic class
              onClick={togglePopup}
              aria-label={`Hesap menüsünü aç - Kullanıcı: ${username}`}
              aria-expanded={isPopupOpen} // Accessibility improvement
            >
              <FaUser className="nav-icon" /> {username}
            </button>
            {isPopupOpen && (
              <div
                ref={popupRef}
                className="account-popup"
                onMouseLeave={handleMouseLeave}
              >
                <ul className="popup-list">
                  <li>
                    <Link
                      to="/change-password"
                      className="popup-item"
                      onClick={() => setIsPopupOpen(false)}
                    >
                      <FaKey className="popup-icon" /> Şifre Değiştir
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="popup-item"
                      onClick={() => setIsPopupOpen(false)}
                    >
                      <FaIdCard className="popup-icon" /> Profil
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/membership"
                      className="popup-item"
                      onClick={() => setIsPopupOpen(false)}
                    >
                      <FaUserCog className="popup-icon" /> Üyelik
                    </Link>
                  </li>
                  <li>
                    <button
                      className="popup-item logout-button"
                      onClick={() => {
                        handleLogout();
                        setIsPopupOpen(false);
                      }}
                    >
                      <FaSignOutAlt className="popup-icon" /> Çıkış Yap
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bottom-bar">
          <p>© 2025 akb</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;