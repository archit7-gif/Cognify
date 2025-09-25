

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setUser, setAuthError, setAuthLoading } from '../../app/slices/authSlice';
import { setToast } from '../../app/slices/uiSlice';
import { apiClient } from '../../api/apiClient';
import Button from '../Common/Button';
import ThemeToggle from '../Common/ThemeToggle';
import AuthToast from '../Auth/AuthToast';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // ADD THIS LINE
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(setAuthLoading(true));

    try {
      console.log('Attempting login with:', formData);
      const response = await apiClient.post('/api/auth/login', formData);
      console.log('Login response:', response);
      
      dispatch(setUser(response.user));
      dispatch(setToast({ 
        type: 'success', 
        message: 'Welcome back! Logged in successfully.',
        duration: 2000
      }));
      navigate('/chats');
    } catch (error) {
      console.error('Login error:', error);
      
      const errorMessage = error.message || 'Invalid credentials. Please check your email and password.';
      
      dispatch(setAuthError(errorMessage));
      dispatch(setToast({ 
        type: 'error', 
        message: errorMessage,
        duration: 3000
      }));
    } finally {
      setLoading(false);
      dispatch(setAuthLoading(false));
    }
  };

  return (
    <div className="auth-page">
      <AuthToast />
      
      <nav className="auth-nav">
        <Link to="/" className="nav-brand">
          <div className="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="m9 9 5 12 1.774-5.226L21 14 9 9z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="brand-text">Cognify</span>
        </Link>
        
        <ThemeToggle />
      </nav>

      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-header">
            <h1>Welcome back</h1>
            <p>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>

            {/* UPDATED PASSWORD FIELD WITH EYE BUTTON */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="password-input"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'} Show password
                >
                  {showPassword ? (
                    // Eye slash (hide) icon
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 3s4 8 9 8a9.26 9.26 0 0 0 5.49-1.31" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    // Eye (show) icon
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>


            <Button
              type="submit"
              loading={loading}
              className="auth-submit-btn"
              disabled={!formData.email || !formData.password}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


