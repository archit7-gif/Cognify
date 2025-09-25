
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearToast } from '../../app/slices/uiSlice';
import './AuthToast.css';

const AuthToast = () => {
  const dispatch = useDispatch();
  const { toast } = useSelector((state) => state.ui);

  useEffect(() => {
    if (toast && !toast.persistent) {
      const timer = setTimeout(() => {
        dispatch(clearToast());
      }, toast.duration || 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  if (!toast) return null;

  return (
    <div className={`auth-toast auth-toast--${toast.type}`}>
      <div className="auth-toast-content">
        <span className="auth-toast-icon">
          {toast.type === 'success'}
          {toast.type === 'error' }
          {toast.type === 'warning'}
        </span>
        <span className="auth-toast-message">{toast.message}</span>
      </div>
      <button 
        className="auth-toast-close"
        onClick={() => dispatch(clearToast())}
      >
        ×
      </button>
    </div>
  );
};

export default AuthToast;
