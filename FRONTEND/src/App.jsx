


import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './app/slices/authSlice';
import { setMobileView } from './app/slices/uiSlice';
import { setTheme } from './app/slices/themeSlice'; // Add this import
import { connectSocket, disconnectSocket } from './utils/socket';
import AppRoutes from './routes';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme); // Add this

  useEffect(() => {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    dispatch(setTheme(savedTheme));
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Check if user info exists in localStorage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        dispatch(setUser(JSON.parse(userInfo)));
      } catch (error) {
        localStorage.removeItem('userInfo');
      }
    }

    // Handle mobile view detection
    const handleResize = () => {
      dispatch(setMobileView(window.innerWidth < 768));
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      connectSocket();
      localStorage.setItem('userInfo', JSON.stringify(user));
    } else {
      disconnectSocket();
      localStorage.removeItem('userInfo');
    }
  }, [user]);

  return <AppRoutes />;
}

export default App;

