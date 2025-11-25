// src/components/SavingsPromo.jsx

import React from 'react';
import './SavingsPromo.css';
// We'll add an icon later
// import { BanknotesIcon } from '@heroicons/react/24/outline';

const SavingsPromo = () => {
  return (
    <div className="savings-promo-card">
      <div className="promo-icon-wrapper">
        {/* Placeholder Icon */}
        <span className="promo-icon">💰</span> 
      </div>
      <div className="promo-content">
        <h2 className="promo-title">Grow Your Savings</h2>
        <p className="promo-description">
          Explore our Fixed Deposit (FD) schemes and earn up to 7.5% p.a. Secure your future with guaranteed returns.
        </p>
      </div>
      <div className="promo-action">
        <button className="btn-promo" onClick={() => alert('TODO: Go to Savings Page')}>
          Explore Schemes
        </button>
      </div>
    </div>
  );
};

export default SavingsPromo;