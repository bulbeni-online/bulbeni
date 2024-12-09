import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Assuming axios is used for API calls
import './RoleManagement.css';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  
  useEffect(() => {
    // Fetch users from the backend (json-server or other API)
    axios.get('http://localhost:5000/roles')
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.error('Error fetching roles:', error);
      });
  }, []);


  return (
    <div>
      <h2>Role Management</h2>
      <table>
        <thead>
          <tr>
            <th>Role</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.name}>
              <td>{role.name}</td>
              <td>{role.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleManagement;
