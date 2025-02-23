// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AddUrlPage from "./pages/AddUrlPage";
import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute
import LogoutPage from "./pages/LogoutPage";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<LoginPage />} />

        <Route element={<Layout />}>

          {/* Private routes */}
          <Route path="/dashboard" element={<PrivateRoute element={DashboardPage} />} />
          <Route path="/add-url" element={<PrivateRoute element={AddUrlPage} />} />
          <Route path="/logout" element={<PrivateRoute element={LogoutPage} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;


