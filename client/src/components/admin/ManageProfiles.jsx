import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ManageProfiles() {
  const [users, setUsers] = useState([]); // Ensure users is initialized as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch users from backend
  useEffect(() => {
    axios.get('http://localhost:3000/admin-api/users')
      .then(response => {
        if (response.data.payload) {
          console.log(response.data.payload);
          setUsers(response.data.payload); // Access `payload` from API response
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setError('Failed to load users');
        setLoading(false);
      });
  }, []);

  // Toggle block/unblock status
  const handleToggle = (userEmail, isActive) => {
    axios.put(`http://localhost:3000/admin-api/users/${userEmail}`, { isActive: !isActive }) // Ensure endpoint matches backend
      .then(response => {
        setUsers(users.map(user =>
          user.email === userEmail ? { ...user, isActive: !isActive } : user
        ));
      })
      .catch(error => {
        console.error('Error updating user status:', error);
        setError('Failed to update user status');
      });
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="container">
      <h2 className="text-center my-4">Manage User Profiles</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user.email}>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={user.isActive} 
                      onChange={() => handleToggle(user.email, user.isActive)} 
                    />
                    <span className="slider round"></span>
                  </label>
                  {user.isActive ? 'Active' : 'Blocked'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">No users found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* CSS for the switch */}
      <style>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 20px;
        }
        .switch input { 
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 20px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 14px;
          width: 14px;
          left: 4px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: #4CAF50;
        }
        input:checked + .slider:before {
          transform: translateX(18px);
        }
      `}</style>
    </div>
  );
}

export default ManageProfiles;
