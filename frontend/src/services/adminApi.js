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