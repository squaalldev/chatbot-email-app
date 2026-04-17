import React from 'react';
import type { ChatSummary } from '../App';

interface Props {
  chats: ChatSummary[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
}

function ChatHistory({ chats, currentChatId, onSelectChat, onNewChat }: Props) {
  return (
    <div className="chat-history">
      <button className="new-chat-btn" onClick={onNewChat}>
        ＋ Nuevo chat
      </button>
      <div className="chat-list">
        {chats.map((chat) => (
          <div
            key={chat.chat_id}
            className={`chat-item ${chat.chat_id === currentChatId ? 'active' : ''}`}
            onClick={() => onSelectChat(chat.chat_id)}
          >
            {chat.chat_id === currentChatId ? '● ' : ''}
            {chat.title}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatHistory;
