// src/pages/HomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import InstallApp from '../components/InstallApp';
import Navbar from '../components/Navbar';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      {/* --- Header / Navbar --- */}
      <Navbar />

      {/* --- Hero Section --- */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Banking Made Simple.</h1>
          <p className="hero-subtitle">
            Manage your finances, invest your money, and secure your future.
            All in one secure platform.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
            <Link to="/register" className="btn-hero-cta">Open an Account Today</Link>
            <InstallApp />
          </div>
        </div>

        <div className="hero-image-wrapper">
          <img
            src="/hero-image.jpg"
            alt="Person using online banking on a mobile phone"
            className="hero-image"
          />
        </div>

      </section>

      {/* --- Features Section --- */}
      <section className="features-section">
        <h2 className="section-title">Your Complete Financial Hub</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🏦 Save</h3>
            <p>Earn up to 7.5% on Fixed Deposits. Grow your wealth with our secure savings plans.</p>
          </div>
          <div className="feature-card">
            <h3>📈 Invest</h3>
            <p>Explore mutual funds, stocks, and other investment opportunities. (Coming Soon)</p>
          </div>
          <div className="feature-card">
            <h3>💸 Borrow</h3>
            <p>Get instant personal loans, home loans, and car loans at competitive rates. (Coming Soon)</p>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} The Digital Bank. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;