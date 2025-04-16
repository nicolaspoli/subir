import React, { useEffect, useState, useRef } from 'react';

const SatelliteTable = () => {
  const [satellites, setSatellites] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedMission, setSelectedMission] = useState('Todos');
  const [selectedCountry, setSelectedCountry] = useState('Todos');
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
      console.log(`Mensaje recibido: ${event.data}`);
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
          const updated = exists
            ? prev.map(s =>
                s.satellite_id === satellite.satellite_id
                  ? { ...satellite, flag, lat: s.lat, lng: s.lng }
                  : s
              )
            : [...prev, { ...satellite, flag }];
          return updated.sort((a, b) => b.altitude - a.altitude);
        });
      }

      if (data.type === 'POSITION_UPDATE') {
        const { satellite_id, lat, lng, altitude } = data;
        setSatellites(prev =>
          prev.map(s =>
            s.satellite_id === satellite_id
              ? { ...s, lat, lng, altitude }
              : s
          )
        );
      } 

      if (data.type === 'CATASTROPHIC-FAILURE') {
        console.log(`CATASTROPHIC-FAILURE: Satélite ${data.satellite_id} ha sido destruido.`);
        setSatellites(prev => prev.filter(s => s.satellite_id !== data.satellite_id));
      }
      
      if (data.type === 'DEORBITING') {
        console.log(`DEORBITING: Satélite ${data.satellite_id} ha salido de órbita.`);
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
        const type = data.type;
      
        setSatellites(prev =>
          prev.map(s => {
            if (s.satellite_id !== data.satellite_id) return s;
      
            const oldPower = s.power || 0;
            const newPower = oldPower + delta;
            console.log(`${type}: Satélite ${s.satellite_id} de ${oldPower} a ${newPower}`);
      
            return { ...s, power: newPower };
          })
        );
      }

      if (data.type === 'COMM') {
        console.log(`Mensaje recibido: ${data.message?.content || 'Mensaje sin contenido'}`);
      }
    };

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const countryCodeToFlag = (code) => {
    return code
      .toUpperCase()
      .replace(/./g, char =>
        String.fromCodePoint(127397 + char.charCodeAt())
      );
  };

  useEffect(() => {
    let filteredSatellites = satellites;

    if (selectedMission !== 'Todos') {
      filteredSatellites = filteredSatellites.filter(s => s.mission === selectedMission);
    }

    if (selectedCountry !== 'Todos') {
      filteredSatellites = filteredSatellites.filter(s => s.organization.country.name === selectedCountry);
    }

    setFiltered(filteredSatellites);
  }, [satellites, selectedMission, selectedCountry]);

  const missions = Array.from(new Set(satellites.map(s => s.mission))).sort();
  const countries = Array.from(new Set(satellites.map(s => s.organization.country.name))).sort();

  return (
    <div>
      <h2>Satélites</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Misión:&nbsp;
          <select value={selectedMission} onChange={e => setSelectedMission(e.target.value)}>
            <option value="Todos">Todos</option>
            {missions.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>

        <label style={{ marginLeft: '1rem' }}>
          País:&nbsp;
          <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)}>
            <option value="Todos">Todos</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
      </div>

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
    <tr><td colSpan="10">Cargando datos...</td></tr>
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
