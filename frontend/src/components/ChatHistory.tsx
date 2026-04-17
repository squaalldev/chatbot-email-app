import React from 'react';

function ChatHistory({ chats, currentChatId, onSelectChat, onNewChat }: any) {
  return (
    <div className="chat-history">
      <button className="new-chat-btn" onClick={onNewChat}>
        ＋ Nuevo chat
      </button>
      <div className="chat-list">
        {Object.entries(chats).map(([chatId, messages]: any) => (
          <div
            key={chatId}
            className={`chat-item ${chatId === currentChatId ? 'active' : ''}`}
            onClick={() => onSelectChat(chatId)}
          >
            {chatId === currentChatId ? '● ' : ''}
            {messages && messages.length > 0 
              ? messages[0].content.substring(0, 30) + '...'
              : `Chat ${chatId}`
            }
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatHistory;
