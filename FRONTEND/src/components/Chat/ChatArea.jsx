
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setMessages, 
  appendMessage, 
  setMessagesLoading 
} from '../../app/slices/messagesSlice';
import { setToast } from '../../app/slices/uiSlice';
import { updateChatTitle } from '../../app/slices/chatsSlice';
import { apiClient } from '../../api/apiClient';
import { getSocket } from '../../utils/socket';
import MessageItem from './MessageItem';
import Composer from './Composer';
import Loader from '../Common/Loader';
import './ChatArea.css';

const ChatArea = () => {
  const { chatId } = useParams();
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const responseTimeoutRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState(null);
  
  const { byChat } = useSelector((state) => state.messages);
  const currentChat = byChat[chatId] || { items: [], status: 'idle' };
  const { items: chats } = useSelector((state) => state.chats);
  
  const currentChatData = chats.find(chat => chat._id === chatId);

  useEffect(() => {
    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat.items]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleAiResponse = (data) => {
      if (data.chat === chatId) {
        // CLEAR TIMEOUT AND REMOVE ERROR MESSAGES
        clearTimeout(responseTimeoutRef.current);
        
        // Remove any existing error messages first
        const messagesWithoutErrors = currentChat.items.filter(msg => 
          !(msg.role === 'system' && msg.status === 'error')
        );
        
        // Add the new AI response
        const newMessages = [
          ...messagesWithoutErrors,
          {
            _id: Date.now().toString(),
            content: data.content,
            role: 'model',
            createdAt: new Date().toISOString(),
          }
        ];
        
        dispatch(setMessages({ chatId, messages: newMessages }));
        
        // Update chat title if it's still "New Chat" and this is the first response
        if (currentChatData?.title === 'New Chat' && messagesWithoutErrors.length <= 1) {
          const userMessage = messagesWithoutErrors.find(msg => msg.role === 'user');
          if (userMessage) {
            const newTitle = userMessage.content.length > 30 
              ? userMessage.content.substring(0, 30) + '...'
              : userMessage.content;
            
            dispatch(updateChatTitle({ chatId, title: newTitle }));
            
            apiClient.put(`/api/chat/${chatId}/title`, { title: newTitle })
              .catch(err => console.error('Failed to update title on backend:', err));
          }
        }
        
        setIsAiResponding(false);
        setLastUserMessage(null);
      }
    };

    socket.on('ai-response', handleAiResponse);

    return () => {
      socket.off('ai-response', handleAiResponse);
    };
  }, [chatId, dispatch, currentChatData, currentChat.items]);

  const fetchMessages = async () => {
    if (!chatId) return;

    setIsLoading(true);
    dispatch(setMessagesLoading({ chatId, loading: true }));

    try {
      const response = await apiClient.get(`/api/chat/${chatId}/messages`);
      dispatch(setMessages({ chatId, messages: response.messages || [] }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      dispatch(setToast({ 
        type: 'error', 
        message: 'Failed to load messages' 
      }));
    } finally {
      setIsLoading(false);
      dispatch(setMessagesLoading({ chatId, loading: false }));
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResponseError = (errorMessage) => {
    setIsAiResponding(false);
    
    dispatch(appendMessage({
      chatId,
      message: {
        _id: Date.now().toString(),
        content: errorMessage,
        role: 'system',
        status: 'error',
        createdAt: new Date().toISOString(),
        canRegenerate: true
      }
    }));

    dispatch(setToast({ 
      type: 'error', 
      message: errorMessage
    }));
  };

  const handleRegenerateResponse = () => {
    if (!lastUserMessage) {
      dispatch(setToast({ 
        type: 'error', 
        message: 'No message to regenerate' 
      }));
      return;
    }

    // Remove all error messages
    const filteredMessages = currentChat.items.filter(msg => 
      !(msg.role === 'system' && msg.status === 'error')
    );
    
    dispatch(setMessages({ chatId, messages: filteredMessages }));
    
    // Clear any existing timeout
    clearTimeout(responseTimeoutRef.current);
    
    // Resend the message
    handleSendMessage(lastUserMessage.content);
  };

  const handleSendMessage = async (content) => {
    if (!content.trim() || !chatId) return;

    const socket = getSocket();
    if (!socket || !socket.connected) {
      dispatch(setToast({ 
        type: 'error', 
        message: 'Connection lost. Please refresh the page.' 
      }));
      return;
    }

    // Clear any existing timeout first
    clearTimeout(responseTimeoutRef.current);

    const userMessage = {
      _id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    dispatch(appendMessage({ chatId, message: userMessage }));
    setLastUserMessage(userMessage);
    setIsAiResponding(true);

    // INCREASED TIMEOUT TO 45 SECONDS FOR LONG REQUESTS
    responseTimeoutRef.current = setTimeout(() => {
      handleResponseError('Response timeout. Tap to Regenerate.');
    }, 45000); // 45 seconds instead of 10

    socket.emit('ai-message', {
      chat: chatId,
      content: content.trim(),
    });
  };

  // CLEANUP TIMEOUT ON UNMOUNT
  useEffect(() => {
    return () => {
      clearTimeout(responseTimeoutRef.current);
    };
  }, []);

  if (!chatId) {
    return (
      <div className="chat-area">
        <div className="empty-chat-container">
          <div className="empty-chat-content">
            <h2>Select a chat to start messaging</h2>
            <p>Choose a conversation from the sidebar or create a new one to begin.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-area">
      {/* Messages Container */}
      <div className="messages-container">
        {isLoading ? (
          <div className="messages-loading">
            <Loader text="Loading messages..." />
          </div>
        ) : currentChat.items.length === 0 ? (
          <div className="messages-empty">
            <h3>Start a conversation</h3>
            <p>Send a message to begin chatting with the AI assistant.</p>
          </div>
        ) : (
          <div className="messages-list">
            {currentChat.items.map((message) => (
              <MessageItem
                key={message._id}
                message={message}
                onRegenerate={handleRegenerateResponse}
              />
            ))}

            {isAiResponding && (
              <div className="ai-typing">
                <div className="typing-container">
                  <div className="typing-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Composer */}
      <Composer 
        onSendMessage={handleSendMessage}
        disabled={isAiResponding}
        placeholder={isAiResponding ? "AI is responding..." : "Type a message..."}
      />
    </div>
  );
};

export default ChatArea;

