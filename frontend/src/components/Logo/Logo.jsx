// frontend/src/components/Logo/Logo.js
import React from 'react';

const Logo = () => (
  <svg width="240" height="72" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="12" width="48" height="48" rx="6" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="2.4"></rect>
    <line x1="24" y1="12" x2="24" y2="60" stroke="#FFFFFF" stroke-width="2.4"></line>
    <line x1="36" y1="12" x2="36" y2="60" stroke="#FFFFFF" stroke-width="2.4"></line>
    <line x1="18" y1="24" x2="54" y2="24" stroke="#FFFFFF" stroke-width="1.2"></line>
    <line x1="18" y1="36" x2="54" y2="36" stroke="#FFFFFF" stroke-width="1.2"></line>
    <line x1="18" y1="48" x2="54" y2="48" stroke="#FFFFFF" stroke-width="1.2"></line>
    <text x="72" y="48" font-family="Arial, sans-serif" font-size="28.8" font-weight="bold" fill="#FFFFFF">Notes</text>
  </svg>
);

export default Logo;