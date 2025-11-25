// src/components/QuickActions.jsx

import React from 'react';
import './QuickActions.css';

// This is now a "dumb" component. It just reports clicks.
const QuickActions = ({ onDeposit, onWithdraw, onTransfer, isAdmin }) => {
  return (
    <div className="quick-actions-container">
      <button className="action-btn" onClick={onDeposit}>
        {isAdmin ? (
          <span>Cash Deposit</span>
        ) : (
          <>
            <span style={{ fontSize: '1.5rem', display: 'block' }}>💳</span>
            <span>Add Money</span>
          </>
        )}
      </button>
      <button className="action-btn" onClick={onWithdraw}>
        {isAdmin ? (
          <span>Cash Withdraw</span>
        ) : (
          <>
            <span style={{ fontSize: '1.5rem', display: 'block' }}>🧾</span>
            <span>Pay Bill</span>
          </>
        )}
      </button>
      <button className="action-btn" onClick={onTransfer}>
        <span>Transfer</span>
      </button>
    </div>
  );
};

export default QuickActions;