
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleSidebar } from '../../app/slices/uiSlice';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const Navbar = ({ showSidebarToggle = false, chatTitle = null }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <nav className="main-navbar">
      <div className="navbar-left">
        {showSidebarToggle && (
          <button 
            className="sidebar-toggle-btn"
            onClick={() => dispatch(toggleSidebar())}
            title="Toggle sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/>
              <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2"/>
              <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        )}
        
        <Link to="/chats" className="navbar-brand">
          <div className="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="m9 9 5 12 1.774-5.226L21 14 9 9z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="brand-text">Marron AI</span>
        </Link>
      </div>

      <div className="navbar-center">
        {chatTitle && (
          <div className="chat-title-display">
            
          </div>
        )}
      </div>

      <div className="navbar-right">
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;

