import React, { useState } from 'react';
import { Activity, ClipboardList, Calendar } from 'lucide-react';
import LoginModal from '../components/auth/LoginModal';
import RegisterModal from '../components/auth/RegisterModal';
import './HomePage.css';

const HomePage = () => {
  const [activeModal, setActiveModal] = useState(null); // 'login', 'register', or null

  const openLogin = () => setActiveModal('login');
  const openRegister = () => setActiveModal('register');
  const closeModal = () => setActiveModal(null);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page" style={{ position: 'relative', zIndex: 1, backgroundColor: 'white' }}>

      {/* Navbar */}
      <nav className="navbar-simple" style={{ position: 'sticky', top: 0, zIndex: 1000, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #eaeaea' }}>
        <div className="container nav-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
          <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Activity className="text-primary" size={32} />
            <span className="brand-name" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>Chopade Clinical Lab</span>
          </div>

          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => scrollToSection('services')} className="nav-text-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#1e293b' }}>Services</button>
            <button onClick={() => scrollToSection('about')} className="nav-text-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#1e293b' }}>About</button>
            <button onClick={() => scrollToSection('contact')} className="nav-text-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#1e293b' }}>Contact Us</button>

            <button onClick={openLogin} className="btn-secondary" style={{ padding: '0.5rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', color: '#1e293b', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer' }}>Login</button>
            <button onClick={openRegister} className="btn-primary" style={{ padding: '0.5rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', color: 'white', background: '#2563eb', border: 'none', cursor: 'pointer' }}>Register</button>
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
            <button onClick={openRegister} className="btn btn-primary btn-lg">Book an Appointment</button>
            <button onClick={() => scrollToSection('services')} className="btn btn-secondary btn-lg">View Test Menu</button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services container" style={{ padding: '4rem 0' }}>
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

      {/* About Section */}
      <section id="about" className="container" style={{ padding: '4rem 0', background: '#f8f9fa' }}>
        <h2 className="section-title text-center">About Us</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#555' }}>
            Chopade Clinical Laboratory has been serving the community with precision and care for over 15 years.
            We are committed to providing high-quality diagnostic services using the latest technology and automated analyzers.
            Our team of experienced pathologists and technicians ensures that you get accurate results, every time.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container" style={{ padding: '4rem 0' }}>
        <h2 className="section-title text-center">Contact Us</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
          <div className="contact-info">
            <h3>Visit Us</h3>
            <p>123 Health Street, Wellness City, 411001</p>
            <p>Maharashtra, India</p>

            <h3 style={{ marginTop: '1.5rem' }}>Call Us</h3>
            <p>+91 98765 43210</p>
            <p>020-12345678</p>
          </div>
          <div className="contact-form-dummy" style={{ background: '#f0f4f8', padding: '2rem', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0 }}>Send a Message</h3>
            <input type="text" placeholder="Your Name" style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }} />
            <input type="email" placeholder="Your Email" style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }} />
            <textarea placeholder="Message" rows="4" style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}></textarea>
            <button className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer text-center" style={{ marginTop: 'auto', padding: '2rem 0', background: '#2c3e50', color: 'white' }}>
        <p>© 2025 Chopade Clinical Laboratory. All rights reserved.</p>
      </footer>

      {/* Auth Modals */}
      <LoginModal
        isOpen={activeModal === 'login'}
        onClose={closeModal}
        onSwitchToRegister={openRegister}
      />
      <RegisterModal
        isOpen={activeModal === 'register'}
        onClose={closeModal}
        onSwitchToLogin={openLogin}
      />
    </div>
  );
};

export default HomePage;