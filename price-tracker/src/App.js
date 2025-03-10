// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductPage from "./pages/ProductPage";
import PriceMonitoringPage from "./pages/PriceMonitoringPage";
import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute
import LogoutPage from "./pages/LogoutPage";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />

        <Route element={<Layout />}>

          {/* Private routes */}
          <Route path="/" element={<PrivateRoute element={DashboardPage} />} />
          <Route path="/dashboard" element={<PrivateRoute element={DashboardPage} />} />
          <Route path="/product" element={<PrivateRoute element={ProductPage} />} />
          <Route path="/price-monitor" element={<PrivateRoute element={PriceMonitoringPage} />} />
          <Route path="/logout" element={<PrivateRoute element={LogoutPage} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;


