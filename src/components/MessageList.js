import React from 'react';

function formatTimestamp(createdAt) {
  const date = new Date(createdAt);
  return date.toLocaleTimeString();
}

function MessageList({ messages, currentUserId }) {
  return (
    <ul className="message-list">
      {messages.map((message, index) => {
        return (
          <li key={message.messageId || index}
            className={message.isCurrentUser ? 'message-sent' : 'message-received'}>
            <div>
              <strong>{message.sender.nickname || message.sender.userId}:</strong> {message.message}
              <div style={{fontSize: '0.8rem', marginTop: '5px'}}>
                Sent at {formatTimestamp(message.createdAt)}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default MessageList;

