// src/pages/LoginPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      const target = user.roles.includes('ROLE_ADMIN') ? '/admin/dashboard' : '/dashboard';
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(username, password);
      if (user) {
        if (user.roles && user.roles.includes('ROLE_ADMIN')) {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Login successful, but failed to fetch user details.');
      }
    } catch (err) {
      console.error('Login failed:', err);
      if (err.response && err.response.status === 401) {
        setError('Invalid username or password. Please try again.');
      } else {
        setError('Login failed. Please check your connection and try again.');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-header">Welcome Back!</h1>
        <p className="auth-subheader">Please log in to your account.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isAuthLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isAuthLoading}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-button" disabled={isAuthLoading}>
            {isAuthLoading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <p className="auth-switch-link">
          Don't have an account?
          <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;