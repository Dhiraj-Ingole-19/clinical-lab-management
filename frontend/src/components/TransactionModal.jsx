// src/components/TransactionModal.jsx

import React, { useState } from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { makeDeposit, makeWithdrawal, makeTransfer, lookupAccount } from '../services/api';
import { adminMakeDeposit, adminMakeWithdraw, adminMakeTransfer } from '../services/adminApi';
import { formatCurrency } from '../utils/formatters';
import './TransactionModal.css';

// 1. Add new prop 'isAdmin', default to false
const TransactionModal = ({ mode, account, onClose, onSuccess, isAdmin = false }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [targetAccountNumber, setTargetAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Lookup state
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupMessage, setLookupMessage] = useState('');

  // Strict Logic for Teller Mode
  const isTeller = isAdmin || (user?.roles?.includes('ROLE_ADMIN'));

  // Dynamic titles based on role
  const getTitle = () => {
    if (mode === 'deposit') return isTeller ? `Teller Deposit to ${account.type}` : 'Add Money via Card';
    if (mode === 'withdraw') return isTeller ? `Teller Withdraw from ${account.type}` : 'Pay Bill';
    return `Transfer from ${account.type}`;
  };

  const handleLookup = async () => {
    if (!targetAccountNumber) return;

    // If it looks like an account number (starts with ACC), don't look up
    if (targetAccountNumber.toUpperCase().startsWith('ACC')) {
      return;
    }

    setIsLookingUp(true);
    setLookupMessage('');
    setError('');

    try {
      const response = await lookupAccount(targetAccountNumber);
      const { accountNumber } = response.data;
      setTargetAccountNumber(accountNumber);
      setLookupMessage(`✓ Found: ${targetAccountNumber}'s account`);
    } catch (err) {
      console.error("Lookup failed:", err);
      setLookupMessage('');
      // Don't clear the input, just show error
      setError(`❌ User '${targetAccountNumber}' not found or has no active account.`);
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error('Please enter a valid amount.');
      }

      // 2. Use the correct API based on isAdmin
      if (mode === 'deposit') {
        isTeller
          ? await adminMakeDeposit(account.id, parsedAmount)
          : await makeDeposit(account.id, parsedAmount);
      } else if (mode === 'withdraw') {
        isTeller
          ? await adminMakeWithdraw(account.id, parsedAmount)
          : await makeWithdrawal(account.id, parsedAmount);
      } else if (mode === 'transfer') {
        if (!targetAccountNumber) throw new Error('Please enter a target account number.');
        isTeller
          ? await adminMakeTransfer(account.id, targetAccountNumber, parsedAmount)
          : await makeTransfer(account.id, targetAccountNumber, parsedAmount);
      }

      console.log('Transaction successful (Teller: ' + isTeller + ')');
      onSuccess(); // This will close the modal and refresh data

    } catch (err) {
      console.error('Transaction failed:', err);
      setError(err.response?.data?.message || err.message || 'Transaction failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={getTitle()} isOpen={true} onClose={onClose}>
      <form onSubmit={handleSubmit} className="transaction-form">
        <p className="form-subtitle">
          Account: {account.accountNumber}
        </p>
        <p className="form-subtitle" style={{ marginTop: 0, fontWeight: 600 }}>
          Balance: {formatCurrency(account.balance)}
        </p>

        {/* Customer Deposit: Card Details - HIDE IF TELLER */}
        {!isTeller && mode === 'deposit' && (
          <>
            <div className="form-group">
              <label>Card Number</label>
              <input type="text" placeholder="0000 0000 0000 0000" maxLength="19" required />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input type="text" placeholder="123" maxLength="3" required style={{ width: '80px' }} />
            </div>
          </>
        )}

        {/* Customer Withdraw: Biller Name - HIDE IF TELLER */}
        {!isTeller && mode === 'withdraw' && (
          <div className="form-group">
            <label>Biller Name</label>
            <input type="text" placeholder="e.g., Electricity, Internet" required />
          </div>
        )}

        {mode === 'transfer' && (
          <div className="form-group">
            <label htmlFor="targetAccount">Target (Username or Account #)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                id="targetAccount"
                value={targetAccountNumber}
                onChange={(e) => setTargetAccountNumber(e.target.value)}
                onBlur={handleLookup} // Auto-lookup on blur
                placeholder="e.g., dhiraj or ACC..."
                style={{ flexGrow: 1 }}
              />
              <button
                type="button"
                className="btn-outline"
                onClick={handleLookup}
                disabled={isLookingUp || !targetAccountNumber}
                style={{ padding: '0.5rem', fontSize: '0.9rem' }}
              >
                {isLookingUp ? '...' : '🔍'}
              </button>
            </div>
            {lookupMessage && <p style={{ color: 'var(--color-success)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{lookupMessage}</p>}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <div className="amount-input-wrapper">
            <span className="amount-prefix">₹</span>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
            />
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="form-submit-btn" disabled={loading}>
          {loading ? 'Processing...' : `Submit ${mode.charAt(0).toUpperCase() + mode.slice(1)}`}
        </button>
      </form>
    </Modal>
  );
};

export default TransactionModal;