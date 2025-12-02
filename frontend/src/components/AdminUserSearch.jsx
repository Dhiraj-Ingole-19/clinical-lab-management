// src/components/AdminUserSearch.jsx

import React, { useState } from 'react';
import { getUserByUsername } from '../services/adminApi';
import '../pages/AdminDashboardPage.css';

const AdminUserSearch = () => {
  const [searchUsername, setSearchUsername] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchUsername) return;

    setLoadingSearch(true);
    setSearchError('');
    setFoundUser(null);
    try {
      const response = await getUserByUsername(searchUsername);
      setFoundUser(response.data);
    } catch (err) {
      console.error("User search failed:", err);
      setSearchError(err.response?.data?.message || 'User not found');
    } finally {
      setLoadingSearch(false);
    }
  };

  return (
    <div className="admin-section">
      <h2>Find Patient</h2>
      <form className="user-search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by exact username..."
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
        />
        <button type="submit" className="btn-primary" disabled={loadingSearch}>
          {loadingSearch ? '...' : 'Search'}
        </button>
      </form>
      {searchError && <p className="form-error">{searchError}</p>}

      {foundUser && (
        <div className="user-details-card">
          <div className="user-details-header">
            <h3>{foundUser.username} (ID: {foundUser.id})</h3>
            <span className={`status ${foundUser.enabled ? 'status-active' : 'status-inactive'}`}>
              {foundUser.enabled ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className="patient-info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <strong>Full Name:</strong> {foundUser.fullName || 'N/A'}
            </div>
            <div>
              <strong>Mobile:</strong> {foundUser.phoneNumber || 'N/A'}
            </div>
            <div>
              <strong>Age:</strong> {foundUser.age || 'N/A'}
            </div>
            <div>
              <strong>Gender:</strong> {foundUser.gender || 'N/A'}
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <strong>Address:</strong> {foundUser.address || 'N/A'}
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4>Appointment History</h4>
            <p style={{ color: '#666', fontStyle: 'italic' }}>
              (To view appointments, please use the "All Appointments" tab and filter by this user)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserSearch;