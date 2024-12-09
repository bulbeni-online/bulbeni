import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateUserForm.css';

const CreateUserForm = ({ onUserCreated }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [roles, setRoles] = useState([]);

  // Fetch roles when the component mounts
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/roles');
        setRoles(response.data); // Set roles from the response
        setRole('');
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = { username, email, password, role };

    try {
      const response = await axios.post('http://localhost:5000/users', newUser);
      onUserCreated(response.data);
      setUsername('');
      setEmail('');
      setPassword('');
      setRole(''); // Reset role after submission
    } catch (error) {
      console.error('Error creating user:', error);
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
        <option value="">Select</option>
        {roles.map((role) => (
          <option key={role.name} value={role.name}>
            {role.name}
          </option>
        ))}
      </select>
      <button type="submit">Create User</button>
    </form>
  );
};

export default CreateUserForm;
