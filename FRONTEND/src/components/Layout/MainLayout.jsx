import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setMobileView, clearToast, setSidebarOpen } from '../../app/slices/uiSlice'; // ADD setSidebarOpen import
import Navbar from '../Common/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const dispatch = useDispatch();
  const { chatId } = useParams();
  const { sidebarOpen, mobileView, toast } = useSelector((state) => state.ui);
  const { items: chats } = useSelector((state) => state.chats);
  
  // Find current chat title
  const currentChat = chats.find(chat => chat._id === chatId);
  const chatTitle = currentChat?.title;

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      dispatch(setMobileView(isMobile));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  useEffect(() => {
    if (toast && !toast.persistent) {
      const timer = setTimeout(() => {
        dispatch(clearToast());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  // ADD THIS FUNCTION - Close sidebar when clicking outside
  const handleMainContentClick = () => {
    if (sidebarOpen) {
      dispatch(setSidebarOpen(false));
    }
  };

  return (
    <div className="app-layout">
      {/* Fixed Navigation Bar */}
      <Navbar showSidebarToggle={true} chatTitle={chatTitle} />

      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast--${toast.type}`}>
          <div className="toast-content">
            <span className="toast-icon">
              {toast.type === 'success'}
              {toast.type === 'error'}
              {toast.type === 'warning'}
            </span>
            <span className="toast-message">{toast.message}</span>
          </div>
          <button 
            className="toast-close"
            onClick={() => dispatch(clearToast())}
          >
            ×
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="content-wrapper">
        {/* Sidebar */}
        <aside className={`sidebar-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <Sidebar />
        </aside>

        {/* Main Content - ADD CLICK HANDLER */}
        <main 
          className="main-content"
          onClick={handleMainContentClick}
        >
          {children}
        </main>

        {/* Mobile Overlay */}
        {mobileView && sidebarOpen && (
          <div 
            className="mobile-overlay"
            onClick={() => dispatch(setSidebarOpen(false))}
          />
        )}
      </div>
    </div>
  );
};

export default MainLayout;



