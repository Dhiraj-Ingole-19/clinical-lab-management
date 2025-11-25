// src/components/Navbar.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { UserCircle, Wallet, LogOut, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="navbar glass-panel">
      <div className={`navbar-container ${!user ? 'public-mobile-layout' : ''}`}>
        <Link to={user ? "/dashboard" : "/"} className="navbar-brand" onClick={closeMenu}>
          <Wallet className="brand-icon" />
          <span className="brand-text">The Digital Bank</span>
        </Link>

        {/* Public Menu (Always visible on mobile, no toggle) */}
        {!user && (
          <div className="navbar-public-menu">
            <Link to="/about" className="nav-btn-public">About</Link>
            <Link to="/contact" className="nav-btn-public">Contact</Link>
            <Link to="/login" className="nav-btn-public">Login</Link>
            <Link to="/register" className="nav-btn-public primary">Register</Link>
          </div>
        )}

        {/* User Desktop Menu */}
        {user && (
          <div className="navbar-user-menu desktop-only">
            <span className="navbar-welcome-text">
              Welcome, {user.username}
            </span>
            <Link to="/settings" className="nav-profile-icon" title="Profile & Settings">
              <UserCircle size={28} />
            </Link>
            <button onClick={logout} className="navbar-logout-btn" aria-label="Log Out">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        )}

        {/* Mobile Menu Toggle (Only for Logged-in Users) */}
        {user && (
          <button className="mobile-menu-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>

      {/* Mobile Menu Dropdown (Only for Logged-in Users) */}
      {user && isMobileMenuOpen && (
        <div className="navbar-mobile-menu glass-panel">
          <div className="mobile-user-info">
            <UserCircle size={32} />
            <span>{user.username}</span>
          </div>
          <Link to="/settings" className="mobile-nav-link" onClick={closeMenu}>Profile & Settings</Link>
          <button onClick={() => { logout(); closeMenu(); }} className="mobile-nav-link mobile-logout">
            <LogOut size={20} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;