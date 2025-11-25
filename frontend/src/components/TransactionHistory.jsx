// src/components/TransactionHistory.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyTransactions } from '../services/api';
import TransactionItem from './TransactionItem';
import './TransactionHistory.css';

const TransactionHistory = ({ accountId }) => {
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const userAccountIds = useMemo(() => 
    new Set(user?.accounts?.map(acc => acc.id) || [])
  , [user?.accounts]);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getMyTransactions();

        // This filters for the *selected account*
        const filtered = response.data.filter(tx => 
          tx.sourceAccountId === accountId || 
          tx.targetAccountId === accountId
        );
        
        // This sorts the filtered list
        const sorted = filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        setAllTransactions(sorted);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        setError('Could not load transaction history.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [accountId]); 

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  if (error) {
    return <p className="form-error">{error}</p>;
  }
  
  // Get the 5 most recent transactions
  const recentTransactions = allTransactions.slice(0, 5);

  return (
    <div className="transaction-history">
      <h2 className="transaction-history-title">Recent Transactions</h2>
      
      {recentTransactions.length === 0 ? (
        <div className="empty-state-small">
          <p>No transactions found for this account.</p>
        </div>
      ) : (
        <div className="transaction-list">
          {recentTransactions.map(tx => (
            <TransactionItem 
              key={tx.id} 
              transaction={tx} 
              userAccountIds={userAccountIds} 
            />
          ))}
        </div>
      )}
      
      {allTransactions.length > 5 && (
        <div className="view-all-link">
          <Link to="/transactions">
            View All Transactions ({allTransactions.length})
          </Link>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;