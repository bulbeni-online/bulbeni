import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Correct imports for v6+
import LeftBar from './components/LeftBar'; // Import the LeftBar
import UserList from './components/UserList'; // The page for user management
import RoleManagement from './components/RoleManagement'; // The new Role Management page
import './App.css'; // Global styles

const App = () => {
  return (
    <Router>
      <div className="app">
        <LeftBar /> {/* Render the LeftBar on the left side */}
        
        <div className="main-content">
          <h1>Welcome to Bulbeni</h1>
          
          <Routes>
            <Route path="/users" element={<UserList />} />
            <Route path="/roles" element={<RoleManagement />} /> {/* Route for Role Management */}
            {/* Add more routes as you add more models */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
