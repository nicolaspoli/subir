import React, { useEffect, useRef, useState } from 'react';
import GlobeComponent from './components/Globe';
import SatelliteTable from './components/SatelliteTable';
import Chat from './components/Chat';
import './index.css';

const App = () => {
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('wss://tarea-2.2025-1.tallerdeintegracion.cl/connect');
    setWs(socket);

    return () => socket.close();
  }, []);

  return (
    <div className="app-container">
      <div className="left-column">
        <h1>Tarea 2 Nicolás Poli: Houston, we have a problem</h1>
        <SatelliteTable ws={ws} />
        <Chat ws={ws} />
      </div>
      <div className="right-column">
        <GlobeComponent />
      </div>
    </div>
  );
};

export default App;
