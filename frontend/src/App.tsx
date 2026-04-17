import React, { useEffect, useState } from 'react';
import './App.css';
import ChatWindow from './components/ChatWindow';
import ChatHistory from './components/ChatHistory';

export interface ChatSummary {
  chat_id: string;
  title: string;
  updated_at: number;
}

function App() {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatSummary[]>([]);

  const fetchChats = async () => {
    const response = await fetch('/api/chats');
    if (!response.ok) {
      throw new Error('No se pudieron cargar los chats');
    }
    const data: ChatSummary[] = await response.json();
    setChats(data);
    if (!currentChatId && data.length > 0) {
      setCurrentChatId(data[0].chat_id);
    }
  };

  useEffect(() => {
    fetchChats().catch(console.error);
  }, []);

  const handleNewChat = async () => {
    const response = await fetch('/api/chats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      throw new Error('No se pudo crear el chat');
    }

    const created: ChatSummary = await response.json();
    await fetchChats();
    setCurrentChatId(created.chat_id);
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <ChatHistory
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={setCurrentChatId}
          onNewChat={handleNewChat}
        />
      </div>
      <div className="main-content">
        <ChatWindow chatId={currentChatId} onRefreshChats={fetchChats} />
      </div>
    </div>
  );
}

export default App;
