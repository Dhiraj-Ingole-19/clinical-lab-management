import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle, LogOut, Menu, X, Activity, ChevronDown, LayoutDashboard } from 'lucide-react';
import { getNavItems } from '../config/navigation';
import LoginModal from './auth/LoginModal';
import RegisterModal from './auth/RegisterModal';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

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
                {/* Dynamic Authenticated Links from Config */}
                {/* Filter for Desktop Only */}
                {getNavItems(user).filter(item => item.desktop).map(item => (
                  <Link key={item.path} to={item.path} className="nav-link">
                    {item.label}
                  </Link>
                ))}

                {/* User Dropdown */}
                <div className="relative user-dropdown-container">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="nav-profile-trigger flex items-center gap-2"
                  >
                    <UserCircle size={28} className="text-blue-600" />
                    <span className="font-medium text-gray-700">{user.username}</span>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors" onClick={() => setIsUserDropdownOpen(false)}>
                        <LayoutDashboard size={18} /> Dashboard
                      </Link>
                      <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors" onClick={() => setIsUserDropdownOpen(false)}>
                        <UserCircle size={18} /> Profile
                      </Link>
                      <div className="h-px bg-gray-100 my-1"></div>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut size={18} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Backdrop for Dropdown */}
          {isUserDropdownOpen && (
            <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsUserDropdownOpen(false)}></div>
          )}

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
