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
  uid: string;
  onRefreshChats: () => Promise<void>;
  onEnsureChat: () => Promise<string>;
}

const EXAMPLE_PROMPTS = [
  'Ayúdame a definir una audiencia concreta para este correo: dolor principal, deseo y nivel de conciencia.',
  'Convierte mi producto en una promesa clara de transformación sin listar características aburridas.',
  'Dame 3 opciones de CTA claras para este email, con baja fricción y orientadas a una sola acción.',
  'Propón 5 asuntos y 3 ganchos de apertura para aumentar aperturas y clics de este correo.',
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function toUiMessage(msg: ApiMessage, idx: number): Message {
  return {
    id: `${msg.role}-${idx}-${Date.now()}`,
    role: msg.role,
    content: msg.content,
    avatar: msg.role === 'user' ? '👤' : '🤖',
  };
}

function ChatWindow({ chatId, uid, onRefreshChats, onEnsureChat }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const withUid = (path: string) => `${path}${path.includes('?') ? '&' : '?'}uid=${encodeURIComponent(uid)}`;

  const loadMessages = async (targetChatId: string) => {
    const response = await fetch(withUid(`/api/chats/${targetChatId}/messages`));
    if (!response.ok) {
      throw new Error('No se pudo cargar el historial');
    }

    const data: ApiMessage[] = await response.json();
    setMessages(data.map((msg, idx) => toUiMessage(msg, idx)));
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

  const animateAssistantText = async (messageId: string, fullText: string) => {
    let partial = '';
    for (const char of fullText) {
      partial += char;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                content: partial,
              }
            : msg,
        ),
      );
      await sleep(8);
    }
  };

  const sendToCurrentChat = async (content: string, isExample = false) => {
    const activeChatId = await onEnsureChat();

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: 'user',
      content,
      avatar: '👤',
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch(withUid(`/api/chats/${activeChatId}/messages`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, is_example: isExample }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.detail || 'Error enviando mensaje');
      }

      const data = await response.json();
      const assistantId = `${Date.now()}-assistant`;
      const assistantMessage: Message = {
        id: assistantId,
        role: 'assistant',
        content: '',
        avatar: '😀',
      };

      setMessages((prev) => [...prev, assistantMessage]);
      await animateAssistantText(assistantId, data.response ?? '');
      await onRefreshChats();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error enviando mensaje';
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-error`,
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
            <h1 className="robocopy-title">Email Story Creator</h1>
            <span className="brand-author subtitle">By Jesús Cabrera</span>
            <p>✉️ Experto en emails narrativos que conectan historias con ventas de forma natural</p>
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
        {messages.map((msg) => (
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
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Escribe aquí tus instrucciones"
          disabled={loading}
        />
        <button onClick={handleSendMessage} disabled={loading} aria-label="Enviar mensaje">
          ↑
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
