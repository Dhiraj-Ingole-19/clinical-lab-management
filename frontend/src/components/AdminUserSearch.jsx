// src/components/AdminUserSearch.jsx

import React, { useState } from 'react';
import { getUserByUsername } from '../services/adminApi';
import AccountManagementRow from './AccountManagementRow';
import TransactionModal from './TransactionModal';
import TransactionHistory from './TransactionHistory';
import '../pages/AdminDashboardPage.css';

const AdminUserSearch = () => {
  const [searchUsername, setSearchUsername] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState('');

  const [modal, setModal] = useState({ isOpen: false, mode: '', account: null });
  const [showHistoryForUser, setShowHistoryForUser] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchUsername) return;

    setLoadingSearch(true);
    setSearchError('');
    setFoundUser(null);
    setShowHistoryForUser(false);
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

  const openTransactionModal = (mode, account) => {
    setModal({ isOpen: true, mode: mode, account: account });
  };

  const onTransactionSuccess = () => {
    setModal({ isOpen: false, mode: '', account: null });
    handleSearch();
  };

  return (
    <div className="admin-section">
      <h2>Find User</h2>
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
              {foundUser.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          <div className="account-list-header">
            <span>Account</span>
            <span>Balance</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          <div className="account-management-list">
            {foundUser.accounts.length > 0 ? (
              foundUser.accounts.map(account => (
                <AccountManagementRow
                  key={account.id}
                  account={account}
                  onAdminUpdate={handleSearch}
                  onDeposit={() => openTransactionModal('deposit', account)}
                  onWithdraw={() => openTransactionModal('withdraw', account)}
                  onTransfer={() => openTransactionModal('transfer', account)} // Added Transfer
                />
              ))
            ) : (
              <p>This user has no accounts.</p>
            )}
          </div>

          <div className="transaction-history-toggle" style={{ marginTop: '1.5rem' }}>
            <button
              className="btn-outline"
              onClick={() => setShowHistoryForUser(!showHistoryForUser)}
            >
              {showHistoryForUser ? 'Hide' : 'Show'} User Transaction History
            </button>
          </div>

          {showHistoryForUser && (
            <TransactionHistory
              isAdminMode={true}
              userId={foundUser.id}
              limit={5}
            />
          )}
        </div>
      )}

      {/* --- Transaction Modal --- */}
      {modal.isOpen && (
        <TransactionModal
          isAdminMode={true}
          mode={modal.mode}
          account={modal.account}
          onClose={() => setModal({ isOpen: false, mode: '', account: null })}
          onSuccess={onTransactionSuccess}
        />
      )}
    </div>
  );
};

export default AdminUserSearch;