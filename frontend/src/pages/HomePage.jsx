import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Chopade Clinical Lab</h1>
          <p className="hero-subtitle">Accurate Reports. Trusted Care. Home Collection Available.</p>
          <div className="hero-buttons">
            <Link to="/book-test" className="btn-primary">Book a Test</Link>
            <Link to="/menu" className="btn-secondary">View Rate Card</Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <h3>Home Collection</h3>
          <p>We come to your doorstep for sample collection at a minimal charge.</p>
        </div>
        <div className="feature-card">
          <h3>Accurate Reports</h3>
          <p>State-of-the-art equipment ensures 100% accuracy in your reports.</p>
        </div>
        <div className="feature-card">
          <h3>Fast Delivery</h3>
          <p>Get your reports delivered digitally within 24 hours.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;