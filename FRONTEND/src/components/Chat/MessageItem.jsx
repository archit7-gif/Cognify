import { useState } from 'react';
import { formatTime } from '../../utils/format';
import './MessageItem.css';

const MessageItem = ({ message, onRegenerate }) => {
  const [copied, setCopied] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  const isUser = message.role === 'user';
  const isModel = message.role === 'model';
  const isError = message.role === 'system' && message.status === 'error';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  // Error handling
  if (isError) {
    return (
      <div className="message-row message-row--error">
        <div className="error-message-container">
          <div className="error-content">
            <p className="error-text">{message.content}</p>
            {message.canRegenerate && (
              <button 
                className="regenerate-btn" 
                onClick={onRegenerate}
                title="Try again"
              >
                Regenerate
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`message-row ${isUser ? 'message-row--user' : 'message-row--assistant'}`}>
      {/* Message Bubble */}
      <div 
        className={`message-bubble ${isUser ? 'message-bubble--user' : 'message-bubble--assistant'}`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Message Content */}
        <div className="message-content">
          {message.content}
        </div>
        
        {/* Time Only - NO STATUS TICK */}
        <div className="message-meta">
          <span className="message-time">
            {formatTime(message.createdAt)}
          </span>
        </div>
        
        {/* Hover Actions */}
        {showActions && (
          <div className={`message-actions ${isUser ? 'message-actions--user' : 'message-actions--assistant'}`}>
            <button
              className="action-button"
              onClick={handleCopy}
              title={copied ? 'Copied!' : 'Copy'}
            >
              {copied ? '✓' : '📋'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;

