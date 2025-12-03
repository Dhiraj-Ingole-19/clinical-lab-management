import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Chopade Clinical Lab - Accurate Results, Trusted Care.</h1>
          <div className="hero-buttons">
            <Link to="/login" className="btn-primary">Login</Link>
            <Link to="/register" className="btn-secondary">Register</Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <h3>Home Collection</h3>
          <p>We come to your doorstep.</p>
        </div>
        <div className="feature-card">
          <h3>Digital Reports</h3>
          <p>Get reports online.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;