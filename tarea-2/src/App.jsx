import React from 'react';
import GlobeComponent from './components/Globe';
import SatelliteTable from './components/SatelliteTable';
import Chat from './components/Chat';
import './index.css';

const App = () => {
  return (
    <div className="app-container">
      <div className="left-column">
        <h1>Tarea 2: Houston, we have a problem</h1>
        <SatelliteTable />
        <Chat />
      </div>
      <div className="right-column">
        <GlobeComponent />
      </div>
    </div>
  );
};

export default App;
