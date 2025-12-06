import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle, LogOut, Menu, X, Activity } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <Link to={user ? "/dashboard" : "/"} className="navbar-brand" onClick={closeMenu}>
          <Activity className="brand-icon" />
          <span className="brand-text">Chopade Clinical Lab</span>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-menu desktop-only">
          {!user ? (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/menu" className="nav-link">Services</Link>
              <Link to="/login" className="nav-btn-public">Login</Link>
              <Link to="/register" className="nav-btn-public primary">Register</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/profile" className="nav-profile-icon" title="Profile">
                <UserCircle size={28} />
              </Link>
              <button onClick={handleLogout} className="navbar-logout-btn" aria-label="Log Out">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="navbar-mobile-menu glass-panel">
          {!user ? (
            <>
              <Link to="/" className="mobile-nav-link" onClick={closeMenu}>Home</Link>
              <Link to="/menu" className="mobile-nav-link" onClick={closeMenu}>Services</Link>
              <Link to="/login" className="mobile-nav-link" onClick={closeMenu}>Login</Link>
              <Link to="/register" className="mobile-nav-link primary" onClick={closeMenu}>Register</Link>
            </>
          ) : (
            <>
              <div className="mobile-user-info">
                <UserCircle size={32} />
                <span>{user.username}</span>
              </div>
              <Link to="/dashboard" className="mobile-nav-link" onClick={closeMenu}>Dashboard</Link>
              <Link to="/profile" className="mobile-nav-link" onClick={closeMenu}>Profile</Link>
              <button onClick={handleLogout} className="mobile-nav-link mobile-logout">
                <LogOut size={20} /> Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

/* If we want to hide the hamburger on mobile when authenticated, we can rely on React logic or a class.
   For now, we leave Navbar as is, but we could add: */
/* .authenticated .mobile-menu-toggle { display: none !important; } */
