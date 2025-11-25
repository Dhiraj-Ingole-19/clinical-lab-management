// src/components/AccountManagementRow.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import { activateAccount, deactivateAccount, selectUserAccount } from '../services/api';
import './AccountManagementRow.css';

const AccountManagementRow = ({ account, onAdminUpdate, onDeposit, onWithdraw, onTransfer }) => { // Added onTransfer
  const { user, fetchUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const isAdminMode = !!onAdminUpdate;
  const isSelected = !isAdminMode && user.selectedAccountId === account.id;

  const handleToggleActive = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      if (account.active) {
        if (!isAdminMode && isSelected) {
          alert("You cannot deactivate your currently selected account. Please switch to another account first.");
        } else {
          await deactivateAccount(account.id);
        }
      } else {
        await activateAccount(account.id);
      }

      // Refresh the data
      if (isAdminMode) {
        onAdminUpdate(); // Re-run the search in the admin dashboard
      } else {
        await fetchUser(); // Refresh the user's auth context
      }

    } catch (err) {
      console.error("Failed to toggle account status:", err);
      alert(`Error: ${err.response?.data?.message || 'Could not update account'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async () => {
    if (isSelected || !account.active || isAdminMode) return;
    setLoading(true);
    try {
      await selectUserAccount(account.id);
      await fetchUser();
    } catch (err) {
      console.error("Failed to select account:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // We add a class based on the mode to fix the grid
    <div className={`account-row ${isAdminMode ? 'admin-mode' : 'user-mode'} ${!account.active ? 'inactive' : ''}`}>
      <div className="account-info">
        <span className="account-type">{account.type.charAt(0) + account.type.slice(1).toLowerCase()}</span>
        <span className="account-number">{account.accountNumber}</span>
      </div>

      {/* This <div> is now required to match the grid columns */}
      <div className="account-balance-admin">
        {isAdminMode && formatCurrency(account.balance)}
      </div>

      <div className="account-status">
        <span className={`status ${account.active ? 'status-active' : 'status-inactive'}`}>
          {account.active ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="account-actions">
        {/* --- THIS IS THE FIX --- */}
        {/* User-mode gets "Set as Default" */}
        {!isAdminMode && (
          <button
            className="btn-select"
            onClick={handleSelect}
            disabled={isSelected || !account.active || loading}
          >
            {isSelected ? 'Selected' : (account.active ? 'Set as Default' : 'Inactive')}
          </button>
        )}

        {/* Admin-mode gets "Deposit/Withdraw/Transfer" */}
        {isAdminMode && (
          <>
            <button className="btn-action" onClick={() => onDeposit(account)} disabled={loading || !account.active}>Deposit</button>
            <button className="btn-action" onClick={() => onWithdraw(account)} disabled={loading || !account.active}>Withdraw</button>
            <button className="btn-action" onClick={() => onTransfer(account)} disabled={loading || !account.active}>Transfer</button>
          </>
        )}

        {/* Both modes get "Activate/Deactivate" */}
        <button
          className={`btn-toggle ${account.active ? 'btn-deactivate' : 'btn-activate'}`}
          onClick={handleToggleActive}
          disabled={loading || (isSelected && account.active && !isAdminMode)}
        >
          {loading ? '...' : (account.active ? 'Deactivate' : 'Activate')}
        </button>
      </div>
    </div>
  );
};

export default AccountManagementRow;