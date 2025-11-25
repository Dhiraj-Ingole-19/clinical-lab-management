// src/components/ReportModal.jsx

import React, { useState } from 'react';
import Modal from './Modal';
import { requestRollback } from '../services/api';
import './TransactionModal.css'; // We can re-use the same form styles

const ReportModal = ({ transaction, onClose, onSuccess }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await requestRollback(transaction.id, reason);
      onSuccess(); // This will close the modal and show a success message
    } catch (err) {
      console.error('Report failed:', err);
      setError(err.response?.data?.message || err.message || 'Could not submit report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Report Transaction" isOpen={true} onClose={onClose}>
      <form onSubmit={handleSubmit} className="transaction-form">
        <p className="form-subtitle">
          You are reporting transaction ID: <strong>{transaction.id}</strong>
        </p>

        <div className="form-group">
          <label htmlFor="reason">Reason for Report</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide a reason for this request (min 10 characters)..."
            rows={4}
            required
            minLength={10}
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="form-submit-btn" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </Modal>
  );
};

export default ReportModal;