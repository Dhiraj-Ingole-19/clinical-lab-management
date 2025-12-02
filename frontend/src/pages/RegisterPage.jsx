// src/pages/RegisterPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      const target = user.roles.includes('ROLE_ADMIN') ? '/admin/dashboard' : '/dashboard';
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      await register(username, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
      if (err.response && err.response.status === 409) {
        setError('Username already exists. Please choose another.');
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-header">Create Account</h1>
        <p className="auth-subheader">Get started with Chopade Clinical Lab.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
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
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-button">
            Register
          </button>
        </form>

        <p className="auth-switch-link">
          Already have an account?
          <a href="/login">Log in here</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;