import React, { useEffect, useState } from 'react';

interface Message {
  role: 'user' | 'assistant' | 'error';
  content: string;
  avatar: string;
}

interface ApiMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  chatId: string | null;
  onRefreshChats: () => Promise<void>;
}

const EXAMPLE_PROMPTS = [
  'Ayúdame a definir una audiencia concreta para este correo: dolor principal, deseo y nivel de conciencia.',
  'Convierte mi producto en una promesa clara de transformación sin listar características aburridas.',
  'Dame 3 opciones de CTA claras para este email, con baja fricción y orientadas a una sola acción.',
  'Propón 5 asuntos y 3 ganchos de apertura para aumentar aperturas y clics de este correo.',
];

function toUiMessage(msg: ApiMessage): Message {
  return {
    role: msg.role,
    content: msg.content,
    avatar: msg.role === 'user' ? '👤' : '🤖',
  };
}

function ChatWindow({ chatId, onRefreshChats }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const loadMessages = async (targetChatId: string) => {
    const response = await fetch(`/api/chats/${targetChatId}/messages`);
    if (!response.ok) {
      throw new Error('No se pudo cargar el historial');
    }

    const data: ApiMessage[] = await response.json();
    setMessages(data.map(toUiMessage));
  };

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    loadMessages(chatId).catch((error) => {
      console.error(error);
      setMessages([]);
    });
  }, [chatId]);

  const sendToCurrentChat = async (content: string, isExample = false) => {
    if (!chatId) return;

    const userMessage: Message = {
      role: 'user',
      content,
      avatar: '👤',
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, is_example: isExample }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.detail || 'Error enviando mensaje');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        avatar: '🤖',
      };

      setMessages((prev) => [...prev, assistantMessage]);
      await onRefreshChats();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error enviando mensaje';
      setMessages((prev) => [
        ...prev,
        {
          role: 'error',
          content: msg,
          avatar: '⚠️',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const content = input;
    setInput('');
    await sendToCurrentChat(content, false);
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.length === 0 && (
          <div className="initial-menu">
            <h1>Email Story Creator</h1>
            <p>✉️ Experto en emails narrativos que conectan historias con ventas</p>
            <div className="example-buttons">
              <button className="example-btn" onClick={() => sendToCurrentChat(EXAMPLE_PROMPTS[0], true)}>
                Definir audiencia 🎯
              </button>
              <button className="example-btn" onClick={() => sendToCurrentChat(EXAMPLE_PROMPTS[1], true)}>
                Propuesta de valor 💎
              </button>
              <button className="example-btn" onClick={() => sendToCurrentChat(EXAMPLE_PROMPTS[2], true)}>
                CTA que convierte 🚀
              </button>
              <button className="example-btn" onClick={() => sendToCurrentChat(EXAMPLE_PROMPTS[3], true)}>
                Asunto + gancho ✉️
              </button>
            </div>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={`${msg.role}-${idx}-${msg.content.slice(0, 20)}`} className={`message ${msg.role}`}>
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
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={chatId ? 'Escribe aquí tus instrucciones' : 'Crea un chat con “+ Nuevo chat”'}
          disabled={loading || !chatId}
        />
        <button onClick={handleSendMessage} disabled={loading || !chatId}>
          Enviar
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
