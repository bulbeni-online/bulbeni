import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateUserForm.css';

const UpdateUserForm = ({ userId, onUserUpdated }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [roles, setRoles] = useState([]);

  // Fetch roles and user data when the component mounts
  useEffect(() => {
    const fetchRolesAndUserData = async () => {
      try {
        const rolesResponse = await axios.get('http://localhost:5000/roles');
        setRoles(rolesResponse.data);
        
        if (rolesResponse.data.length > 0) {
          setRole(rolesResponse.data[0].name); // Default role
        }

        if (userId) {
          const userResponse = await axios.get(`http://localhost:5000/users/${userId}`);
          const user = userResponse.data;
          setUsername(user.username);
          setEmail(user.email);
          setPassword(user.password);
          setRole(user.role); // Set the current role for the user
        }
      } catch (error) {
        console.error('Error fetching roles or user data:', error);
      }
    };

    fetchRolesAndUserData();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUser = { username, email, password, role };

    try {
      const response = await axios.put(`http://localhost:5000/users/${userId}`, updatedUser);
      onUserUpdated(response.data);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
      >
        {roles.map((role) => (
          <option key={role.name} value={role.name}>
            {role.name}
          </option>
        ))}
      </select>
      <button type="submit">Update User</button>
    </form>
  );
};

export default UpdateUserForm;
