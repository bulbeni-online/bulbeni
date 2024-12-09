import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Assuming axios is used for API calls
import './RoleManagement.css';

const RoleManagement = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    // Fetch users from the backend (json-server or other API)
    axios.get('http://localhost:5000/users')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleRoleChange = (userId, newRole) => {
    // Update the user's role in the backend
    axios.put(`http://localhost:5000/users/${userId}`, { role: newRole })
      .then((response) => {
        // Update the state with the new role
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
      })
      .catch((error) => {
        console.error('Error updating role:', error);
      });
  };

  return (
    <div>
      <h2>Role Management</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role || 'User'}</td>
              <td>
                <select
                  value={user.role || 'User'}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleManagement;
