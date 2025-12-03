import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Advanced Pathology Services at Your Doorstep</h1>
          <p className="hero-subtitle">Accurate Reports. Trusted Care. NABL Certified Lab.</p>
          <div className="hero-buttons">
            <Link to={user ? "/book-test" : "/login"} className="btn-primary">
              Book a Test
            </Link>
            <Link to="/menu" className="btn-secondary">
              View Rate Card
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <h3>Home Collection</h3>
          <p>We come to your doorstep for sample collection at a minimal charge.</p>
        </div>
        <div className="feature-card">
          <h3>Digital Reports</h3>
          <p>Get your reports delivered digitally within 24 hours via Email & WhatsApp.</p>
        </div>
        <div className="feature-card">
          <h3>NABL Certified</h3>
          <p>State-of-the-art equipment ensuring 100% accuracy and compliance.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;