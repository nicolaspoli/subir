import React, { useEffect, useState, useRef } from 'react';

const SatelliteTable = () => {
  const [satellites, setSatellites] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    wsRef.current = new WebSocket('wss://tarea-2.2025-1.tallerdeintegracion.cl/connect');

    wsRef.current.onopen = () => {
      wsRef.current.send(JSON.stringify({
        type: "AUTH",
        name: "Poli",
        student_number: "19624468"
      }));
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'SATELLITES') {
        data.satellites.forEach(id => {
          wsRef.current.send(JSON.stringify({
            type: 'SATELLITE-STATUS',
            satellite_id: id
          }));
        });
      }

      if (data.type === 'SATELLITE-STATUS') {
        const satellite = data.satellite;
        const flag = countryCodeToFlag(satellite.organization.country.country_code);
        
        setSatellites(prev => {
          const exists = prev.find(s => s.satellite_id === satellite.satellite_id);
          if (exists) {
            return prev.map(s =>
              s.satellite_id === satellite.satellite_id
                ? { ...satellite, flag }
                : s
            );
          }
          return [...prev, { ...satellite, flag }];
        });
      }

      if (data.type === 'CATASTROPHIC-FAILURE' || data.type === 'DEORBITING') {
        setSatellites(prev => prev.filter(s => s.satellite_id !== data.satellite_id));
      }

      if (data.type === 'IN-ORBIT') {
        setSatellites(prev => prev.map(s =>
          s.satellite_id === data.satellite_id
            ? { ...s, altitude: data.altitude, status: "in-orbit" }
            : s
        ));
      }

      if (data.type === 'LAUNCH') {
        setSatellites(prev => prev.map(s =>
          s.satellite_id === data.satellite_id
            ? { ...s, status: "launched" }
            : s
        ));
      }

      if (data.type === 'POWER-UP' || data.type === 'POWER-DOWN') {
        const delta = data.type === 'POWER-UP' ? data.amount : -data.amount;
        setSatellites(prev => prev.map(s =>
          s.satellite_id === data.satellite_id
            ? { ...s, power: (s.power || 0) + delta }
            : s
        ));
      }

      if (data.type === 'COMM') {
        console.log(`Mensaje recibido: ${data.message.content}`);
      }
    };

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  // Convierte código de país ("US", "CL") a emoji 🇺🇸 🇨🇱
  const countryCodeToFlag = (code) => {
    return code
      .toUpperCase()
      .replace(/./g, char =>
        String.fromCodePoint(127397 + char.charCodeAt())
      );
  };

  return (
    <div>
      <h2>Satélites</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Bandera</th>
            <th>País</th>
            <th>Nombre</th>
            <th>Misión</th>
            <th>Tipo</th>
            <th>Potencia</th>
            <th>Altitud</th>
            <th>Fecha de Lanzamiento</th>
          </tr>
        </thead>
        <tbody>
          {satellites.length === 0 ? (
            <tr><td colSpan="9">Cargando datos...</td></tr>
          ) : (
            satellites.map(sat => (
              <tr key={sat.satellite_id}>
                <td>{sat.satellite_id}</td>
                <td>{sat.flag}</td>
                <td>{sat.organization.country.name}</td>
                <td>{sat.name}</td>
                <td>{sat.mission}</td>
                <td>{sat.type}</td>
                <td>{sat.power}</td>
                <td>{sat.altitude}</td>
                <td>{sat.launch_date}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SatelliteTable;
