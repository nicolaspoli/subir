import React, { useState } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, date: new Date().toLocaleTimeString() }]);
      setInput('');
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Chat</h2>
      <div style={{ height: '200px', background: '#eee', overflowY: 'scroll', padding: '10px' }}>
        {messages.map((msg, i) => (
          <div key={i}>
            [{msg.date}] <strong>Operador:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        placeholder="Escribe un mensaje..."
        style={{ width: '80%', marginTop: '10px' }}
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
};

export default Chat;
