import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ClipboardList, Calendar } from 'lucide-react';
import './HomePage.css'; // Ensure this file exists or styles are in App.css

const HomePage = () => {
  console.log("HomePage Rendered - Debug Mode 2");

  return (
    <div className="landing-page" style={{ position: 'relative', zIndex: 99999, backgroundColor: 'white' }}>
      {/* Navbar Placeholder (if not global) */}
      <nav className="navbar-simple">
        <div className="container nav-content">
          <div className="logo">
            <Activity className="text-primary" size={28} />
            <span className="brand-name">Chopade Clinical Lab</span>
          </div>
          <div className="nav-links">
            {/* DEBUG: Using standard anchor for Login to test Router vs CSS issue */}
            <a href="/login" className="btn btn-secondary" onClick={() => console.log("Login Clicked (Anchor)")}>Login (A)</a>
            {/* DEBUG: Using Link for Register */}
            <Link to="/register" className="btn btn-primary" onClick={() => console.log("Register Clicked (Link)")}>Register (L)</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content text-center">
          <h1 className="hero-title">Accurate Results, <span className="text-highlight">Trusted Care.</span></h1>
          <p className="hero-subtitle">
            Your health is our priority. Experience state-of-the-art diagnostic services with the convenience of home collection and digital reports.
          </p>
          <div className="hero-actions">
            {/* Using Link components for SPA navigation */}
            <Link to="/register" className="btn btn-primary btn-lg">Book an Appointment</Link>
            <Link to="/test-menu" className="btn btn-secondary btn-lg">View Test Menu</Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services container">
        <h2 className="section-title text-center">Our Services</h2>
        <div className="services-grid">
          <div className="card service-card">
            <div className="icon-box">
              <Calendar size={32} color="var(--color-primary)" />
            </div>
            <h3>Home Collection</h3>
            <p>Schedule a sample collection from the comfort of your home. Safe, sterile, and on time.</p>
          </div>

          <div className="card service-card">
            <div className="icon-box">
              <ClipboardList size={32} color="var(--color-secondary)" />
            </div>
            <h3>Digital Reports</h3>
            <p>Access your test results online as soon as they are ready. Download and share with your doctor easily.</p>
          </div>

          <div className="card service-card">
            <div className="icon-box">
              <Activity size={32} color="#ed6c02" />
            </div>
            <h3>Comprehensive Tests</h3>
            <p>From routine blood work to advanced specialized tests, we cover all your diagnostic needs.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer text-center">
        <p>© 2025 Chopade Clinical Laboratory. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;