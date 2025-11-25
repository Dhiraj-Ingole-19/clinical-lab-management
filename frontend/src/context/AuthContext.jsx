// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// --- THIS IS THE FIX (Part 2) ---
// We now import 'api' as a named import (inside the braces)
import { api, getCurrentUser, selectUserAccount as apiSelectAccount } from '../services/api';
// --- END OF FIX ---

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.data);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch user', err);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const tokenInStorage = localStorage.getItem('token');
    if (tokenInStorage) {
      api.defaults.headers.common['Authorization'] = `Bearer ${tokenInStorage}`;
      setToken(tokenInStorage);
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  const login = async (username, password) => {
    setAuthLoading(true);
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setToken(token);
      const user = await fetchUser();
      return user;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (username, password) => {
    setAuthLoading(true);
    try {
      const response = await api.post('/auth/register', { username, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setToken(token);
      const user = await fetchUser();
      return user;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    window.location.href = '/';
  };

  const selectAccount = async (accountId) => {
    try {
      await apiSelectAccount(accountId);
      await fetchUser();
    } catch (err) {
      console.error("Failed to select account", err);
    }
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    fetchUser,
    selectAccount,
    isAuthenticated: !!token,
    isLoading: loading,
    isAuthLoading: authLoading,
    isAdmin: user?.roles?.includes('ROLE_ADMIN') || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;