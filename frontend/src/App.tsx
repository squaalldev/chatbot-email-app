import React, { useState } from 'react';
import './App.css';
import ChatWindow from './components/ChatWindow';
import ChatHistory from './components/ChatHistory';

function App() {
  const [currentChatId, setCurrentChatId] = useState(Date.now().toString());
  const [chats, setChats] = useState<Record<string, any[]>>({});

  return (
    <div className="app-container">
      <div className="sidebar">
        <ChatHistory 
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={setCurrentChatId}
          onNewChat={() => setCurrentChatId(Date.now().toString())}
        />
      </div>
      <div className="main-content">
        <ChatWindow 
          chatId={currentChatId}
          onUpdateChat={(messages: any[]) => {
            setChats(prev => ({
              ...prev,
              [currentChatId]: messages
            }));
          }}
        />
      </div>
    </div>
  );
}

export default App;
