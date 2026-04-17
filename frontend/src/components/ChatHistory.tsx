import React, { useState, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content: string;
  avatar: string;
}

function ChatWindow({ chatId, onUpdateChat }: any) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages([]);
  }, [chatId]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      avatar: '👤',
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          content: input,
        }),
      });

      if (!response.ok) throw new Error('Error sending message');

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        avatar: '🤖',
      };

      setMessages(prev => [...prev, assistantMessage]);
      onUpdateChat([...messages, userMessage, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'error',
        content: 'Error sending message',
        avatar: '⚠️',
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.length === 0 && (
          <div className="initial-menu">
            <h1>Email Story Creator</h1>
            <p>✉️ Experto en emails narrativos que conectan historias con ventas</p>
            <div className="example-buttons">
              <button className="example-btn">Definir audiencia 🎯</button>
              <button className="example-btn">Propuesta de valor 💎</button>
              <button className="example-btn">CTA que convierte 🚀</button>
              <button className="example-btn">Asunto + gancho ✉️</button>
            </div>
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.role}`}>
            <span className="avatar">{msg.avatar}</span>
            <div className="content">{msg.content}</div>
          </div>
        ))}
        {loading && <div className="message loading">🤖 Escribiendo...</div>}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Escribe aquí tus instrucciones"
          disabled={loading}
        />
        <button onClick={handleSendMessage} disabled={loading}>
          Enviar
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
