import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateUserForm from './CreateUserForm';
import UpdateUserForm from './UpdateUserForm';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/users').then((response) => {
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
      await axios.delete(`http://localhost:5000/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    axios.put(`http://localhost:5000/users/${userId}`, { role: newRole })
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
              Role:
              <select
                value={user.role || 'User'}
                onChange={(e) => handleRoleChange(user.id, e.target.value)}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
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
