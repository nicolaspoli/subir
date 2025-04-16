import React, { useEffect, useState, useRef } from 'react';

const Chat = ({ ws }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const wsRef = useRef(null);

  const AUTH_DATA = {
    type: "AUTH",
    name: "Poli",
    student_number: "19624468"
  };

  useEffect(() => {
    if (!ws) return;
    wsRef.current = ws;

    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'COMM') {
          setMessages(prev => [
            ...prev,
            {
              direction: 'in',
              sender: data.satellite_id || data.name || data.station_id || data.sender || 'Satélite',
              level: data.level,
              text: typeof data.message === 'string' ? data.message : data.message?.content || '',
              timestamp: new Date().toLocaleTimeString()
            }
          ]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    ws.addEventListener('message', handleMessage);
    const openHandler = () => {
      ws.send(JSON.stringify(AUTH_DATA));
    };

    if (ws.readyState === WebSocket.OPEN) {
      openHandler();
    } else {
      ws.addEventListener('open', openHandler, { once: true });
    }
    return () => {
      ws.removeEventListener('message', handleMessage);
    };
  }, [ws]);

  const sendChatMessage = (message) => {
    if (!message.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    const payload = {
      type: "COMM",
      message
    };

    wsRef.current.send(JSON.stringify(payload));
    setMessages(prev => [
      ...prev,
      {
        direction: 'out',
        sender: 'Tú',
        text: message,
        timestamp: new Date().toLocaleTimeString(),
        level: 'info'
      }
    ]);

    setInput('');
  };

  return (
    <div className="chat-container" style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Chat</h2>
      <div className="chat-messages" style={{ height: '300px', overflowY: 'auto', marginBottom: '1rem', padding: '0.5rem', background: '#f9f9f9' }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              color: msg.level === 'warn' ? 'red' : 'black',
              textAlign: msg.direction === 'out' ? 'right' : 'left',
              marginBottom: '0.5rem'
            }}
          >
            <div>
              [{msg.timestamp}] <strong>{msg.sender}</strong>: {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendChatMessage(input)}
          placeholder="Escribe un mensaje..."
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button onClick={() => sendChatMessage(input)} style={{ padding: '0.5rem 1rem' }}>
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Chat;
