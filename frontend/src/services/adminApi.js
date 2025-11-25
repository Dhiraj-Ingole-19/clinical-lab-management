// src/services/adminApi.js
import { api } from './api'; 

/**
 * Searches for a user by their username.
 * (Calls GET /api/admin/users/by-username/{username})
 */
export const getUserByUsername = (username) => {
  return api.get(`/admin/users/by-username/${username}`);
};

/**
 * Gets total count of registered users.
 * (Calls GET /api/admin/users/count)
 */
export const getUserCount = () => {
  return api.get('/admin/users/count');
};

/**
 * Gets all registered users.
 * (Calls GET /api/admin/users)
 */
export const getAllUsers = () => {
  return api.get('/admin/users');
};

/**
 * Gets all transactions for a specific user ID.
 * (Calls GET /api/admin/transactions/user/{userId})
 */
export const getTransactionsForUser = (userId) => {
  return api.get(`/admin/transactions/user/${userId}`);
};

/**
 * Admin-level Deposit
 * (Calls POST /api/admin/transactions/deposit)
 */
export const adminMakeDeposit = (accountId, amount) => {
  return api.post('/admin/transactions/deposit', { accountId, amount });
};

/**
 * Admin-level Withdraw
 * (Calls POST /api/admin/transactions/withdraw)
 */
export const adminMakeWithdraw = (accountId, amount) => {
  return api.post('/admin/transactions/withdraw', { accountId, amount });
};

/**
 * Admin-level Transfer
 * (Calls POST /api/admin/transactions/transfer)
 */
export const adminMakeTransfer = (sourceAccountId, targetAccountNumber, amount) => {
  return api.post('/admin/transactions/transfer', { 
    sourceAccountId, 
    targetAccountNumber, 
    amount 
  });
};

/**
 * Rolls back a specific transaction.
 * (Calls POST /api/admin/transactions/rollback/{transactionId})
 */
export const rollbackTransaction = (transactionId) => {
  return api.post(`/admin/transactions/rollback/${transactionId}`);
};

/**
 * Gets a list of all transactions in the system.
 * (Calls GET /api/admin/transactions/all)
 */
export const getAllTransactions = () => {
  return api.get('/admin/transactions/all');
};

/**
 * Gets all PENDING rollback requests.
 * (Calls GET /api/admin/requests)
 */
export const getPendingRequests = () => {
  return api.get('/admin/requests');
};

/**
 * Approves a rollback request.
 * (Calls POST /api/admin/requests/approve/{requestId})
 */
export const approveRollbackRequest = (requestId) => {
  return api.post(`/admin/requests/approve/${requestId}`);
};

/**
 * Rejects a rollback request.
 * (Calls POST /api/admin/requests/reject/{requestId})
 */
export const rejectRollbackRequest = (requestId) => {
  return api.post(`/admin/requests/reject/${requestId}`);
};