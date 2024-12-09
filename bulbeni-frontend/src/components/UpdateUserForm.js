import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateUserForm.css';

const UpdateUserForm = ({ userId, onUserUpdated }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5000/users/${userId}`).then((response) => {
        const user = response.data;
        setUsername(user.username);
        setEmail(user.email);
        setPassword(user.password);
      });
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUser = { username, email, password };

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
      <button type="submit">Update User</button>
    </form>
  );
};

export default UpdateUserForm;
