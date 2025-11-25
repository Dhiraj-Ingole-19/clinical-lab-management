import React, { useState } from 'react';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import ReportModal from './ReportModal';
import './TransactionItem.css';

const TransactionItem = ({ transaction, userAccountIds }) => {
  const [isReporting, setIsReporting] = useState(false);
  const [isReported, setIsReported] = useState(transaction.reported);

  // --- 1. RESTORED LOGIC: Determine if it is a Debit or Credit ---
  let isDebit = false;
  let description = '';
  let icon = '';

  if (transaction.type === 'WITHDRAW') {
    isDebit = true;
    description = 'Bill Payment / Withdrawal';
    icon = '🧾'; // Receipt icon
  } else if (transaction.type === 'DEPOSIT') {
    isDebit = false;
    description = 'Money Added';
    icon = '💰'; // Money bag
  } else if (transaction.type === 'TRANSFER') {
    // Check if the current user is the Sender (Source)
    if (userAccountIds.has(transaction.sourceAccountId)) {
      isDebit = true;
      description = `Transfer to Acc: ${transaction.targetAccountId}`;
      icon = '↗️'; // Outgoing arrow
    } else {
      isDebit = false;
      description = `Transfer from Acc: ${transaction.sourceAccountId}`;
      icon = '↙️'; // Incoming arrow
    }
  }

  const handleReportSuccess = () => {
    setIsReporting(false);
    setIsReported(true);
    alert("Transaction reported successfully.");
  };

  return (
    <>
      <div className="transaction-item">
        {/* --- 2. RESTORED JSX: Render Icon --- */}
        <div className={`tx-icon ${isDebit ? 'tx-icon-debit' : 'tx-icon-credit'}`}>
          {icon}
        </div>

        {/* --- 3. RESTORED JSX: Render Description & Date --- */}
        <div className="tx-details">
          <span className="tx-description">{description}</span>
          <span className="tx-date">{formatDateTime(transaction.timestamp)}</span>
        </div>

        {/* --- 4. RESTORED JSX: Render Amount --- */}
        <div className={`tx-amount ${isDebit ? 'tx-amount-debit' : 'tx-amount-credit'}`}>
          {isDebit ? '-' : '+'}{formatCurrency(transaction.amount)}
        </div>

        {/* Report Button Logic */}
        <div className="tx-report-action">
          <button
            className="btn-report"
            onClick={() => setIsReporting(true)}
            disabled={isReported}
          >
            {isReported ? 'Reported' : 'Report'}
          </button>
        </div>
      </div>

      {isReporting && (
        <ReportModal
          transaction={transaction}
          onClose={() => setIsReporting(false)}
          onSuccess={handleReportSuccess}
        />
      )}
    </>
  );
};

export default TransactionItem;