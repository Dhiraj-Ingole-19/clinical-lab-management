import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle, LogOut, Menu, X, Activity } from 'lucide-react';
import LoginModal from './auth/LoginModal';
import RegisterModal from './auth/RegisterModal';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsRegisterOpen(false);
    closeMenu();
  };

  const openRegister = () => {
    setIsRegisterOpen(true);
    setIsLoginOpen(false);
    closeMenu();
  };

  return (
    <>
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
                <button onClick={openLogin} className="nav-btn-public">Login</button>
                <button onClick={openRegister} className="nav-btn-public primary">Register</button>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/book-test" className="nav-link">Book Test</Link>
                <Link to="/my-appointments" className="nav-link">My Appointments</Link>
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
                <button onClick={openLogin} className="mobile-nav-link">Login</button>
                <button onClick={openRegister} className="mobile-nav-link primary">Register</button>
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

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={openRegister}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={openLogin}
      />
    </>
  );
};

/* If we want to hide the hamburger on mobile when authenticated, we can rely on React logic or a class.
   For now, we leave Navbar as is, but we could add: */
/* .authenticated .mobile-menu-toggle { display: none !important; } */

export default Navbar;
