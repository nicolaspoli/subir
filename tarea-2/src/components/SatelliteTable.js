import React, { useEffect, useState, useRef } from 'react';

const SatelliteTable = () => {
  const [satellites, setSatellites] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    // Abrir WebSocket
    console.log('Abriendo WebSocket...');
    wsRef.current = new WebSocket('wss://tarea-2.2025-1.tallerdeintegracion.cl/connect');
    
    wsRef.current.onopen = () => {
      console.log('Conexión WebSocket abierta');
      
      // Enviar mensaje de autenticación
      const authMessage = {
        type: "AUTH",
        name: "Poli",
        student_number: "19624468"
      };
      wsRef.current.send(JSON.stringify(authMessage));
      console.log('Mensaje de autenticación enviado');
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Datos recibidos:', data); // Agregamos depuración

      if (data.type === 'SATELLITES') {
        // Solicitar el estado de cada satélite en la lista recibida
        const ids = data.satellites;
        ids.forEach(id => {
          console.log(`Solicitando información para el satélite: ${id}`);
          wsRef.current.send(JSON.stringify({ type: 'SATELLITE-STATUS', satellite_id: id }));
        });
      }

      if (data.type === 'SATELLITE-STATUS') {
        console.log(`Datos del satélite recibido: ${data.satellite.satellite_id}`);
        // Actualizar el estado con la información del satélite
        setSatellites(prev => {
          const exists = prev.find(s => s.satellite_id === data.satellite.satellite_id);
          if (exists) return prev;
          return [...prev, { 
            ...data.satellite, 
            flag: getFlagFromLatLng(data.satellite.position.lat, data.satellite.position.long)
          }];
        });
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('Error en WebSocket:', error);
    };

    wsRef.current.onclose = () => {
      console.log('Conexión WebSocket cerrada');
    };

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const getFlagFromLatLng = (lat, lng) => {
    // Lógica simple de bandera con base en latitud y longitud
    if (lat > 30 && lng < -100) return '🇺🇸'; // EE.UU.
    if (lat > 30 && lng > -10 && lng < 10) return '🇪🇸'; // España
    if (lat < -30 && lng > 100) return '🇦🇺'; // Australia
    return '🏳️'; // bandera desconocida
  };

  return (
    <div>
      <h2>Satélites</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Bandera</th>
            <th>Nombre</th>
            <th>Misión</th>
            <th>Tipo</th>
            <th>Potencia</th>
            <th>Altitud (km)</th>
            <th>Vida útil</th>
          </tr>
        </thead>
        <tbody>
          {satellites.length === 0 ? (
            <tr><td colSpan="8">Cargando datos...</td></tr>
          ) : (
            satellites.map(sat => (
              <tr key={sat.satellite_id}>
                <td>{sat.satellite_id}</td>
                <td>{sat.flag}</td>
                <td>{sat.name}</td>
                <td>{sat.mission}</td>
                <td>{sat.type}</td>
                <td>{sat.power} kW</td>
                <td>{sat.altitude} km</td>
                <td>{sat.lifespan} años</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SatelliteTable;
