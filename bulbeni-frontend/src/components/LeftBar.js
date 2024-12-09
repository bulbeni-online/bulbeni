import React from 'react';
import { Link } from 'react-router-dom'; // Correct import for v6+
import './LeftBar.css';

const LeftBar = () => {
  return (
    <div className="leftbar">
      <div className="leftbar-header">
        <h2>Bulbeni</h2>
      </div>
      <ul className="leftbar-menu">
        <li>
          <Link to="/users">User Management</Link>
        </li>
        <li>
          <Link to="/roles">Role Management</Link> {/* New link for Role Management */}
        </li>
        {/* Add more menu items here as you create new models */}
      </ul>
    </div>
  );
};

export default LeftBar;
