import React, { useEffect, useState } from 'react';
import GlobeComponent from './components/Globe';
import SatelliteTable from './components/SatelliteTable';
import Chat from './components/Chat';
import './index.css';

const App = () => {
  const [websocketData, setWebsocketData] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('wss://tarea-2.2025-1.tallerdeintegracion.cl/connect');

    socket.onopen = () => {
      console.log('✅ Conectado al WebSocket');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'SATELLITES') {
        setWebsocketData(data.satellites);
      }
    };

    socket.onerror = (error) => {
      console.error('❌ Error en WebSocket:', error);
    };

    socket.onclose = () => {
      console.log('🔌 Conexión WebSocket cerrada');
    };

    // Limpieza cuando se desmonta
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="app-container">
      <div className="left-column">
        <h1>Tarea 2: Houston, we have a problem</h1>
        <SatelliteTable data={websocketData} />
        <Chat data={websocketData} />
      </div>
      <div className="right-column">
        <GlobeComponent data={websocketData} />
      </div>
    </div>
  );
};

export default App;
