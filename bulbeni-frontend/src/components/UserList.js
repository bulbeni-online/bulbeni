import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateUserForm from './CreateUserForm';
import UpdateUserForm from './UpdateUserForm';
import './UserList.css';
import config from '../config.js';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    axios.get(`${config.API_URL}/users`).then((response) => {
      setUsers(response.data);
    });
  }, [users]);

  const handleUserCreated = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    setEditingUserId(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${config.API_URL}/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    axios.put(`${config.API_URL}/users/${userId}`, { role: newRole })
      .then((response) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
      })
      .catch((error) => {
        console.error('Error updating role:', error);
      });
  };

  return (
    <div>
      <h1>User Management</h1>
      {editingUserId ? (
        <UpdateUserForm userId={editingUserId} onUserUpdated={handleUserUpdated} />
      ) : (
        <CreateUserForm onUserCreated={handleUserCreated} />
      )}

      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <p>{user.username} ({user.email})</p>
            <label>
              Role:{user.role || 'User'}
            </label>
            <button onClick={() => setEditingUserId(user.id)}>Edit</button>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
