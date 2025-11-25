// src/components/AdminRollbackQueue.jsx

import React, { useState, useEffect } from 'react';
import { getPendingRequests, approveRollbackRequest, rejectRollbackRequest } from '../services/adminApi';
import { formatDateTime, formatCurrency } from '../utils/formatters';
import './AdminRollbackQueue.css';

const AdminRollbackQueue = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null); 

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getPendingRequests();
      setRequests(response.data);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
      setError("Could not load pending requests.");
    } finally {
      setLoading(false); // <-- This is the key
    }
  };

  useEffect(() => {
    fetchRequests(); 
  }, []);

  const handleApprove = async (requestId) => {
    setActionLoading(requestId);
    try {
      await approveRollbackRequest(requestId);
      alert('Request Approved. Transaction has been rolled back.');
      setRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || 'Could not approve request'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId) => {
    setActionLoading(requestId);
    try {
      await rejectRollbackRequest(requestId);
      alert('Request Rejected.');
      setRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || 'Could not reject request'}`);
    } finally {
      setActionLoading(null);
    }
  };

  // --- THIS IS THE FIX ---
  // We now have a separate function to render content based on state
  const renderContent = () => {
    if (loading) {
      return <p>Loading pending requests...</p>;
    }
    if (error) {
      return <p className="form-error">{error}</p>;
    }
    if (requests.length === 0) {
      return <p>No pending requests.</p>; // <-- This will now show correctly
    }

    return requests.map(req => (
      <div key={req.id} className="request-item-detailed">
        <div className="request-header">
          <span className="request-user">User: <strong>{req.username}</strong></span>
          <span className="request-date">Reported: {formatDateTime(req.createdAt)}</span>
        </div>
        <div className="request-tx-details">
          <span className="request-tx-type">{req.transactionType}</span>
          <span className="request-tx-amount">{formatCurrency(req.transactionAmount)}</span>
          <span className="request-tx-info">From: {req.sourceAccount}</span>
          <span className="request-tx-info">To: {req.targetAccount}</span>
          <span className="request-tx-info">Tx Date: {formatDateTime(req.transactionTimestamp)}</span>
          <span className="request-tx-info">Tx ID: {req.transactionId}</span>
        </div>
        <div className="request-reason">
          <strong>Reason:</strong> {req.reason || "No reason provided."}
        </div>
        <div className="request-actions">
          <button 
            className="btn-reject" 
            onClick={() => handleReject(req.id)}
            disabled={actionLoading === req.id}
          >
            Reject
          </button>
          <button 
            className="btn-approve" 
            onClick={() => handleApprove(req.id)}
            disabled={actionLoading === req.id}
          >
            {actionLoading === req.id ? '...' : 'Approve & Rollback'}
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="admin-section">
      <h2>Pending Rollback Requests</h2>
      <div className="request-list">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminRollbackQueue;