// Simulación websocket. En tu caso puede ser conexión real.
export const connectWebSocket = () => {
    console.log("Conexión websocket simulada");
    return {
      onMessage: (callback) => {
        setInterval(() => {
          const msg = { text: "Mensaje simulado", timestamp: Date.now() };
          callback(msg);
        }, 5000);
      }
    };
  };
  