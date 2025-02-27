// frontend/src/components/NavBar/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { apiRequest } from '../../utils/api';
import Logo from '../Logo/Logo';
import { Menu, X, Settings, User, FileText, Archive, LogOut } from 'react-feather';

const NavBar = ({ children, onSearch, activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  const isHomePage = location.pathname === '/home' || location.pathname === '/profile' || location.pathname === '/settings';

  const handleLogout = async () => {
    try {
      if (isLoggedIn) {
        await apiRequest('/auth/logout', 'POST', null, token);
      }
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleTabChange = (tab) => {
    if (setActiveTab) {
      setActiveTab(tab);
    }
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) setIsOpen(false);
  };

  if (!isLoggedIn || !isHomePage) {
    return null;
  }

  return (
    <div className="flex h-screen bg-black">
      {/* Hamburger button for mobile */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-purple-900 rounded-md text-white hover:bg-purple-700 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-gray-950 text-white transform transition-transform duration-300 ease-in-out shadow-lg border-r border-purple-900 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-4">
          {/* App logo/title */}
          <div className="flex items-center justify-center p-2 mb-6">
            <Link to="/home" className="flex items-center">
              <Logo />
            </Link>
          </div>

          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
            />
          </div>

          <div className="pt-4 space-y-2">
            {/* Notes Tab */}
            <button
              onClick={() => handleTabChange("notes")}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-colors ${activeTab === "notes" ? "bg-purple-800 text-white" : "bg-gray-900 text-gray-300 hover:bg-gray-800"}`}
            >
              <FileText size={18} className="mr-3" />
              Notes
            </button>

            {/* Archived Tab */}
            <button
              onClick={() => handleTabChange("archived")}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-colors ${activeTab === "archived" ? "bg-purple-800 text-white" : "bg-gray-900 text-gray-300 hover:bg-gray-800"}`}
            >
              <Archive size={18} className="mr-3" />
              Archived
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 border-t border-purple-900 bg-gray-950">
            {/* Settings */}
            <button
              onClick={() => handleNavigate('/settings')}
              className="w-full text-left px-4 py-3 bg-gray-900 text-gray-300 rounded-lg hover:bg-gray-800 flex items-center transition-colors"
            >
              <Settings size={18} className="mr-3" />
              Settings
            </button>

            {/* Profile */}
            <button
              onClick={() => handleNavigate('/profile')}
              className="w-full text-left px-4 py-3 bg-gray-900 text-gray-300 rounded-lg hover:bg-gray-800 flex items-center transition-colors"
            >
              <User size={18} className="mr-3" />
              Profile
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 bg-purple-700 rounded-lg hover:bg-purple-600 text-white flex items-center transition-colors"
            >
              <LogOut size={18} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile when menu is open */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className={`flex-1 bg-black min-h-screen transition-all duration-300 ${isMobile && isOpen ? 'blur-sm' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default NavBar;