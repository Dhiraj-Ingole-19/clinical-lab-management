// src/components/AccountSwitchModal.jsx

import React from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import './AccountSwitchModal.css';

const AccountSwitchModal = ({ isOpen, onClose }) => {
  const { user, selectAccount } = useAuth();

  const handleSelect = (accountId) => {
    selectAccount(accountId);
    onClose(); // Close the modal after selection
  };

  return (
    <Modal title="Switch Account" isOpen={isOpen} onClose={onClose}>
      <div className="account-switch-list">
        {user.accounts.map((account) => (
          <label 
            key={account.id} 
            className="account-option" 
            htmlFor={`account-${account.id}`}
          >
            <div className="account-option-details">
              <span className="account-option-type">
                {account.type.charAt(0) + account.type.slice(1).toLowerCase()}
              </span>
              <span className="account-option-number">{account.accountNumber}</span>
            </div>
            <input
              type="radio"
              id={`account-${account.id}`}
              name="account"
              checked={user.selectedAccountId === account.id}
              onChange={() => handleSelect(account.id)}
            />
          </label>
        ))}
      </div>
    </Modal>
  );
};

export default AccountSwitchModal;