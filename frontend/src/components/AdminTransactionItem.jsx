// src/components/AdminTransactionItem.jsx

import React from 'react';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import './AdminTransactionItem.css';

// 1. Accept the new 'canRollback' and 'isLoading' props
const AdminTransactionItem = ({ transaction, onRollback, canRollback, isLoading }) => {
  const { id, type, amount, timestamp, sourceAccountId, targetAccountId, reversed } = transaction;

  // 2. Determine button text based on status
  let buttonText = 'Rollback';
  if (reversed) {
    buttonText = 'Reversed';
  } else if (type === 'DEPOSIT') {
    buttonText = 'N/A';
  }

  return (
    <div className={`admin-tx-item ${reversed ? 'reversed' : ''}`}>
      <div className="tx-details-admin">
        <span className="tx-type">{type}</span>
        <span className="tx-date-admin">{formatDateTime(timestamp)}</span>
        <span className="tx-id">ID: {id}</span>
      </div>
      <div className="tx-accounts-admin">
        <span>From: {sourceAccountId || 'N/A'}</span>
        <span>To: {targetAccountId || 'N/A'}</span>
      </div>
      <div className="tx-amount-admin">
        {formatCurrency(amount)}
      </div>
      <div className="tx-action-admin">
        {/* 3. Use the 'canRollback' prop to disable the button */}
        <button 
          className="btn-rollback" 
          onClick={() => onRollback(id)}
          disabled={!canRollback || isLoading} 
        >
          {isLoading ? '...' : buttonText}
        </button>
      </div>
    </div>
  );
};

export default AdminTransactionItem;