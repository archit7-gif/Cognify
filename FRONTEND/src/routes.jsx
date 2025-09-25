


import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Welcome from './components/Welcome/Welcome';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import MainLayout from './components/Layout/MainLayout';
import ChatArea from './components/Chat/ChatArea';

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return !user ? children : <Navigate to="/chats" replace />;
};

// Empty Chat State Component
const EmptyChatState = () => (
  <div className="chat-area">
    <div className="empty-chat-container">
      <div className="empty-chat-content">
        <h2>Select a chat to start messaging</h2>
        <p>Choose a conversation from the sidebar or create a new one to begin chatting with AI.</p>
      </div>
    </div>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={<Welcome />} 
      />
      
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      
      {/* Protected Routes */}
      <Route 
        path="/chats" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <EmptyChatState />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/chats/:chatId" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <ChatArea />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

