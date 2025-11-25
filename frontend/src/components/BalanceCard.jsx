// src/components/BalanceCard.jsx

import React, { useState, useRef, useEffect } from 'react';
import './BalanceCard.css';
import { formatCurrency } from '../utils/formatters';

const BalanceCard = ({ account }) => {
  const [showBalance, setShowBalance] = useState(false);
  
  // Use a ref to store the timeout ID
  const timeoutRef = useRef(null);

  const handleToggleBalance = () => {
    // If a timer is already running, clear it
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (showBalance) {
      // If balance is showing, clicking "Hide" hides it immediately
      setShowBalance(false);
    } else {
      // If balance is hidden, clicking "Show" reveals it...
      setShowBalance(true);
      // ...and sets a timer to hide it again after 3 seconds
      timeoutRef.current = setTimeout(() => {
        setShowBalance(false);
        timeoutRef.current = null;
      }, 3000); // 3000 milliseconds = 3 seconds
    }
  };
  
  // Clean up the timer if the component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);


  return (
    <div className="balance-card">
      <div className="balance-card-header">
        <h3 className="balance-card-title">Available Balance</h3>
        <button 
          className="balance-toggle-btn" 
          onClick={handleToggleBalance} // Use the new handler
        >
          {/* Emoji is removed, text changes */}
          {showBalance ? 'Hide' : 'Show'} 
        </button>
      </div>

      <div className="balance-card-amount">
        {showBalance ? formatCurrency(account.balance) : '₹ ••••••••'}
      </div>
      
      <span className={`status ${account.active ? 'Active' : 'Inactive'}`}>
        {account.active ? 'Active' : 'Inactive'}
      </span>
    </div>
  );
};

export default BalanceCard;