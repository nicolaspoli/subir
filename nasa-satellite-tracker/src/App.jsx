import { useState, useEffect } from 'react'
import GlobeComponent from './components/GlobeComponent'
import SatelliteTable from './components/SatelliteTable'
import ChatComponent from './components/ChatComponent'
import useWebSocket from './hooks/useWebSocket'
import './styles/App.css'

function App() {
  const [satellites, setSatellites] = useState([])
  const [selectedSatellite, setSelectedSatellite] = useState(null)
  const [chatMessages, setChatMessages] = useState([
    'Welcome to Satellite Tracker!',
    'Select a satellite to view details'
  ])

  useEffect(() => {
    // Datos de ejemplo
    const mockSatellites = [
      { 
        id: 1, 
        name: 'ISS', 
        latitude: 0, 
        longitude: 0, 
        altitude: 408, 
        status: 'Operational',
        description: 'International Space Station'
      },
      { 
        id: 2, 
        name: 'Hubble', 
        latitude: 10, 
        longitude: 20, 
        altitude: 540, 
        status: 'Operational',
        description: 'Hubble Space Telescope'
      },
      { 
        id: 3, 
        name: 'GPS III', 
        latitude: -15, 
        longitude: 45, 
        altitude: 20200, 
        status: 'Maintenance',
        description: 'GPS Navigation Satellite'
      },
    ]
    setSatellites(mockSatellites)
  }, [])

  const handleSatelliteSelect = (satellite) => {
    setSelectedSatellite(satellite)
    addChatMessage(`Selected satellite: ${satellite.name}`)
  }

  const addChatMessage = (message) => {
    setChatMessages(prev => [...prev, message])
  }

  return (
    <div className="app-container">
      <header>
        <h1>Satellite Tracker</h1>
      </header>
      <div className="main-content">
        <div className="globe-section">
          <GlobeComponent 
            satellites={satellites} 
            selectedSatellite={selectedSatellite}
            onSelect={handleSatelliteSelect}
          />
        </div>
        <div className="data-section">
        <SatelliteTable 
          satellites={satellites}
          selectedSatellite={selectedSatellite}
          onSelect={handleSatelliteSelect}
        />

        <ChatComponent 
          messages={chatMessages}
          onNewMessage={addChatMessage}
        />
        </div>
      </div>
    </div>
  )
}

export default App