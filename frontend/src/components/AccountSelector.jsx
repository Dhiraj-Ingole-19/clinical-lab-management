// src/components/AccountSelector.jsx

import React from 'react';
import './AccountSelector.css';

const AccountSelector = ({ selectedAccount, onSwitchAccount }) => {
  return (
    <div className="account-selector-wrapper">
      <div className="selected-account-info">
        <h1 className="selected-account-type">
          {selectedAccount.type.charAt(0) + selectedAccount.type.slice(1).toLowerCase()} Account
        </h1>
        <span className="selected-account-number">{selectedAccount.accountNumber}</span>
      </div>
      
      <button className="switch-account-btn" onClick={onSwitchAccount}>
        Switch Account
      </button>
    </div>
  );
};

export default AccountSelector;