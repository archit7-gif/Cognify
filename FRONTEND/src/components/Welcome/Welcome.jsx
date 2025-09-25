import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../Common/Button';
import ThemeToggle from '../Common/ThemeToggle'; // Add this import
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  if (user) {
    navigate('/chats');
    return null;
  }

  const handleStartNewChat = () => {
    navigate('/login');
  };

  const handleViewChats = () => {
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="welcome-page">
      <div className="welcome-container">
        {/* Navigation Bar */}
        <nav className="top-nav">
          <div className="nav-brand">
            <div className="brand-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="m9 9 5 12 1.774-5.226L21 14 9 9z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="brand-text">Marron AI</span>
          </div>
          
          {/* Add theme toggle and login */}
          <div className="nav-actions">
            <ThemeToggle />
            <button className="nav-login" onClick={handleLogin}>
              Sign in
            </button>
          </div>
        </nav>

        {/* Rest of your existing code... */}
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Your AI-powered conversation companion with memory and context awareness
            </h1>
            <p className="hero-subtitle">
              Engage in natural, contextual conversations. AI remembers your previous conversations and provides instant responses with real-time WebSocket communication.
            </p>
            
            <div className="hero-actions">
              <Button 
                onClick={handleStartNewChat}
                className="cta-primary"
                size="medium"
              >
                Get started
              </Button>
              {/* <Button 
                onClick={handleViewChats}
                variant="secondary"
                className="cta-secondary"
                size="large"
              >
                View chats
              </Button> */}
            </div>
          </div>

          <div className="hero-visual">
            <div className="chat-preview">
              <div className="chat-header">
                <div className="chat-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="chat-messages">
                <div className="message user-message">
                  <div className="message-content">Explain quantum computing</div>
                </div>
                <div className="message ai-message">
                  <div className="message-avatar">AI</div>
                  <div className="message-content">Quantum computing uses quantum mechanics...</div>
                </div>
                <div className="message user-message">
                  <div className="message-content">Can you simplify that?</div>
                </div>
                <div className="message ai-message typing">
                  <div className="message-avatar">AI</div>
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="features-section">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Smart Conversations</h3>
              <p>Engage in natural, contextual conversations with our AI assistant</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27C12.09 15.41 10.61 16 9.5 16A6.5 6.5 0 0 1 3 9.5A6.5 6.5 0 0 1 9.5 3m0 2C7.01 5 5 7.01 5 9.5S7.01 14 9.5 14 14 11.99 14 9.5 11.99 5 9.5 5z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Memory & Context</h3>
              <p>AI remembers your previous conversations and maintains context</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Real-time Responses</h3>
              <p>Get instant responses with our real-time WebSocket communication</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

