import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import ProductPage from "./pages/ProductPage";
import PriceMonitoringPage from "./pages/PriceMonitoringPage";
import ProfilePage from "./pages/ProfilePage"; // Import ProfilePage
import PrivateRoute from "./components/PrivateRoute";
import LogoutPage from "./pages/LogoutPage";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Private routes under Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<PrivateRoute element={DashboardPage} />} />
          <Route path="/dashboard" element={<PrivateRoute element={DashboardPage} />} />
          <Route path="/product" element={<PrivateRoute element={ProductPage} />} />
          <Route path="/price-monitor" element={<PrivateRoute element={PriceMonitoringPage} />} />
          <Route path="/profile" element={<PrivateRoute element={ProfilePage} />} /> {/* New route */}
          <Route path="/logout" element={<PrivateRoute element={LogoutPage} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;