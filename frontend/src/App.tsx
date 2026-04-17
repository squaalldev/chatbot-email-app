import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import ChatWindow from './components/ChatWindow';
import ChatHistory from './components/ChatHistory';

export interface ChatSummary {
  chat_id: string;
  title: string;
  updated_at: number;
}

const USER_STORAGE_KEY = 'chatbot_uid';

function getOrCreateUid() {
  const existing = localStorage.getItem(USER_STORAGE_KEY);
  if (existing) return existing;
  const generated = crypto.randomUUID();
  localStorage.setItem(USER_STORAGE_KEY, generated);
  return generated;
}

function App() {
  const uid = useMemo(() => getOrCreateUid(), []);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const fetchWithUid = (path: string, init?: RequestInit) => {
    const separator = path.includes('?') ? '&' : '?';
    return fetch(`${path}${separator}uid=${encodeURIComponent(uid)}`, init);
  };

  const fetchChats = async () => {
    const response = await fetchWithUid('/api/chats');
    if (!response.ok) {
      throw new Error('No se pudieron cargar los chats');
    }
    const data: ChatSummary[] = await response.json();
    setChats(data);
  };

  useEffect(() => {
    fetchChats().catch(console.error);
  }, []);

  const createChat = async () => {
    const response = await fetchWithUid('/api/chats', {
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
    return created.chat_id;
  };

  const ensureChat = async () => {
    if (currentChatId) return currentChatId;
    return createChat();
  };

  return (
    <div className="app-container">
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarCollapsed((prev) => !prev)}
          aria-label={sidebarCollapsed ? 'Mostrar menú de chats' : 'Ocultar menú de chats'}
          title={sidebarCollapsed ? 'Mostrar menú' : 'Ocultar menú'}
        >
          {sidebarCollapsed ? '»' : '«'}
        </button>

        {!sidebarCollapsed && (
          <ChatHistory
            chats={chats}
            currentChatId={currentChatId}
            onSelectChat={setCurrentChatId}
            onNewChat={createChat}
          />
        )}
      </div>
      <div className="main-content">
        <ChatWindow
          chatId={currentChatId}
          uid={uid}
          onRefreshChats={fetchChats}
          onEnsureChat={ensureChat}
        />
      </div>
    </div>
  );
}

export default App;
