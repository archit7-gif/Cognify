

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  setToast, 
  setSidebarOpen 
} from '../../app/slices/uiSlice';
import { 
  setChats, 
  addChat, 
  removeChat, 
  setCurrentChatId,
  updateChatTitle,
  setChatsLoading,
  setChatsError 
} from '../../app/slices/chatsSlice';
import { clearUser } from '../../app/slices/authSlice';
import { apiClient } from '../../api/apiClient';
import { formatDate } from '../../utils/format';
import Button from '../Common/Button';
import Modal from '../Common/Modal';
import Loader from '../Common/Loader';
import './Sidebar.css';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chatId } = useParams();
  
  const { user } = useSelector((state) => state.auth);
  const { items: chats, currentChatId, status } = useSelector((state) => state.chats);
  const { mobileView } = useSelector((state) => state.ui);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [editingChat, setEditingChat] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  useEffect(() => {
    if (chatId && chatId !== currentChatId) {
      dispatch(setCurrentChatId(chatId));
    }
  }, [chatId, currentChatId, dispatch]);

  const fetchChats = async () => {
    dispatch(setChatsLoading(true));
    try {
      const response = await apiClient.get('/api/chat');
      dispatch(setChats(response.chats || []));
    } catch (error) {
      console.error('Failed to fetch chats:', error);
      dispatch(setChatsError(error.message));
      dispatch(setToast({ 
        type: 'error', 
        message: 'Failed to load chats. Please refresh the page.' 
      }));
    } finally {
      dispatch(setChatsLoading(false));
    }
  };

  const handleCreateChat = async () => {
    try {
      const response = await apiClient.post('/api/chat', { title: 'New Chat' });
      dispatch(addChat(response.chat));
      dispatch(setCurrentChatId(response.chat._id));
      navigate(`/chats/${response.chat._id}`);
      
      if (mobileView) {
        dispatch(setSidebarOpen(false));
      }
    } catch (error) {
      console.error('Failed to create chat:', error);
      dispatch(setToast({ 
        type: 'error', 
        message: 'Failed to create new chat' 
      }));
    }
  };

  const handleChatClick = (chat) => {
    dispatch(setCurrentChatId(chat._id));
    navigate(`/chats/${chat._id}`);
    
    if (mobileView) {
      dispatch(setSidebarOpen(false));
    }
  };

  const handleDeleteChat = (chat, e) => {
    e.stopPropagation();
    setChatToDelete(chat);
    setShowDeleteModal(true);
  };

  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;

    try {
      await apiClient.delete(`/api/chat/${chatToDelete._id}`);
      dispatch(removeChat(chatToDelete._id));
      
      if (currentChatId === chatToDelete._id) {
        const remainingChats = chats.filter(c => c._id !== chatToDelete._id);
        if (remainingChats.length > 0) {
          navigate(`/chats/${remainingChats[0]._id}`);
        } else {
          navigate('/chats');
        }
      }
      
      dispatch(setToast({ 
        type: 'success', 
        message: 'Chat deleted successfully' 
      }));
    } catch (error) {
      console.error('Failed to delete chat:', error);
      dispatch(setToast({ 
        type: 'error', 
        message: 'Failed to delete chat' 
      }));
    } finally {
      setShowDeleteModal(false);
      setChatToDelete(null);
    }
  };

  const handleEditTitle = (chat, e) => {
    e.stopPropagation();
    setEditingChat(chat._id);
    setNewTitle(chat.title);
  };

  const handleSaveTitle = async () => {
    if (!editingChat || !newTitle.trim()) return;

    try {
      await apiClient.put(`/api/chat/${editingChat}/title`, { 
        title: newTitle.trim() 
      });
      dispatch(updateChatTitle({ 
        chatId: editingChat, 
        title: newTitle.trim() 
      }));
      dispatch(setToast({ 
        type: 'success', 
        message: 'Chat title updated' 
      }));
    } catch (error) {
      console.error('Failed to update chat title:', error);
      dispatch(setToast({ 
        type: 'error', 
        message: 'Failed to update chat title' 
      }));
    } finally {
      setEditingChat(null);
      setNewTitle('');
    }
  };

  const handleCancelEdit = () => {
    setEditingChat(null);
    setNewTitle('');
  };

  const handleLogout = async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      dispatch(clearUser());
      navigate('/login');
      dispatch(setToast({ 
        type: 'success', 
        message: 'Logged out successfully' 
      }));
    }
  };

  return (
    <>
      <div className="sidebar">
        {/* New Chat Button */}
        <div className="sidebar-header">
          <Button
            onClick={handleCreateChat}
            className="new-chat-btn"
            title="Start new chat"
          >
            <span className="btn-icon">+</span>
            New chat
          </Button>
        </div>

        {/* Chat List */}
        <div className="sidebar-content">
          <div className="chat-list">
            {status === 'loading' ? (
              <Loader size="small" text="Loading chats..." />
            ) : chats.length === 0 ? (
              <div className="empty-state">
                <p>No chats yet</p>
              </div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat._id}
                  className={`chat-item ${currentChatId === chat._id ? 'chat-item--active' : ''}`}
                  onClick={() => handleChatClick(chat)}
                >
                  <div className="chat-item-content">
                    {editingChat === chat._id ? (
                      <div className="chat-edit">
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveTitle();
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          className="chat-edit-input"
                          autoFocus
                        />
<div className="chat-edit-actions">
  <button onClick={handleSaveTitle} className="btn-save">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </button>
  <button onClick={handleCancelEdit} className="btn-cancel">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="m18 6-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="m6 6 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </button>
</div>

                      </div>
                    ) : (
                      <>
                        <div className="chat-info">
                          <h3 className="chat-title">{chat.title}</h3>
                          <p className="chat-date">{formatDate(chat.lastActivity)}</p>
                        </div>
<div className="chat-actions">
  <button
    onClick={(e) => handleEditTitle(chat, e)}
    className="chat-action-btn"
    title="Rename chat"
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </button>
  <button
    onClick={(e) => handleDeleteChat(chat, e)}
    className="chat-action-btn chat-action-btn--delete"
    title="Delete chat"
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="m3 6 3 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="m8 6 0 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="m13 6 8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="m10 11 0 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="m14 11 0 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </button>
</div>

                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* User Info & Logout */}
        {user && (
          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar">
                {user.fullname.firstname.charAt(0)}{user.fullname.lastname.charAt(0)}
              </div>
              <div className="user-details">
                <p className="user-name">
                  {user.fullname.firstname} {user.fullname.lastname}
                </p>
                <p className="user-email">{user.email}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="secondary"
              size="small"
              className="logout-btn"
            >
              Logout
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Chat"
      >
        <div className="delete-modal-content">
          <p>Are you sure you want to delete "{chatToDelete?.title}"?</p>
          <p className="delete-warning">This action cannot be undone.</p>
          
          <div className="modal-actions">
            <Button
              onClick={() => setShowDeleteModal(false)}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteChat}
              className="delete-confirm-btn"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;

