// src/components/AdminAllTransactions.jsx

import React, { useState, useEffect } from 'react';
import { getAllTransactions, rollbackTransaction } from '../services/adminApi';
import AdminTransactionItem from './AdminTransactionItem';
import '../pages/AdminDashboardPage.css'; // Re-use styles

const AdminAllTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null); // Tracks button loading

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllTransactions();
      const sorted = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setTransactions(sorted);
    } catch (err) {
      console.error("Failed to fetch all transactions:", err);
      setError(err.response?.data?.message || 'Could not load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleRollback = async (transactionId) => {
    if (!window.confirm(`Are you sure you want to roll back transaction ID: ${transactionId}? This is irreversible.`)) {
      return;
    }
    setActionLoading(transactionId);
    try {
      await rollbackTransaction(transactionId);
      alert('Transaction rolled back successfully.');
      fetchTransactions(); // Refresh the list
    } catch (err) {
      console.error("Rollback failed:", err);
      alert(`Error: ${err.response?.data?.message || 'Could not roll back transaction'}`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div>Loading all transactions...</div>;
  }
  if (error) {
    return <p className="form-error">{error}</p>;
  }

  return (
    <div className="admin-section">
      <h2>All System Transactions</h2>
      <div className="admin-transaction-list">
        {transactions.length > 0 ? (
          transactions.map(tx => {
            // --- THIS IS THE FIX ---
            // A transaction CANNOT be rolled back if it is a DEPOSIT
            // or if it is ALREADY reversed (tx.reversed is true).
            const canRollback = tx.type !== 'DEPOSIT' && !tx.reversed;

            return (
              <AdminTransactionItem 
                key={tx.id} 
                transaction={tx} 
                onRollback={handleRollback} 
                canRollback={canRollback} // Pass the prop
                isLoading={actionLoading === tx.id} // Pass loading state
              />
            );
          })
        ) : (
          <p>No transactions in the system.</p>
        )}
      </div>
    </div>
  );
};

export default AdminAllTransactions;