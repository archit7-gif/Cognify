
import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Button from '../Common/Button';
import './Composer.css';

const Composer = ({ onSendMessage, disabled = false, placeholder = "Type a message..." }) => {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef(null);
  const { composing } = useSelector((state) => state.messages);

  useEffect(() => {
    if (composing) {
      setMessage(composing);
    }
  }, [composing]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 150; // Maximum height in pixels
      
      if (scrollHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.height = `${scrollHeight}px`;
        textarea.style.overflowY = 'hidden';
      }
      
      setIsExpanded(scrollHeight > 56); // Single line height
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      setIsExpanded(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Allow new line with Shift+Enter
        return;
      } else {
        // Send message with Enter
        e.preventDefault();
        handleSubmit(e);
      }
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleBlur = () => {
    if (!message.trim()) {
      setIsExpanded(false);
    }
  };

  return (
    <div className="composer">
      <form onSubmit={handleSubmit} className="composer-form">
        <div className={`composer-input-container ${isExpanded ? 'composer-input-container--expanded' : ''}`}>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            className="composer-textarea"
            rows={1}
          />
          
          <div className="composer-actions">
<button
  type="submit"
  disabled={!message.trim() || disabled}
  className="send-button"
  title="Send message (Enter)"
>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
  </svg>
</button>


          </div>
        </div>
        
        {isExpanded && (
          <div className="composer-hint">
            <span>Press <kbd>Enter</kbd> to send, <kbd>Shift + Enter</kbd> for new line</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default Composer;
