// websocket.js
let socket;

export const connectWebSocket = (onMessageCallback) => {
  socket = new WebSocket('wss://tarea-2.2025-1.tallerdeintegracion.cl/connect');

  socket.onopen = () => {
    console.log('✅ Conectado al WebSocket');
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessageCallback(data);
  };

  socket.onerror = (error) => {
    console.error('❌ WebSocket error:', error);
  };

  socket.onclose = (event) => {
    console.log('🔌 WebSocket cerrado', event.code, event.reason);
  };
};

export const sendMessage = (message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.warn('WebSocket no está listo para enviar mensajes');
  }
};
