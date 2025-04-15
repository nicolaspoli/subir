import React, { useEffect, useState } from 'react';

const SatelliteTable = () => {
  const [satellites, setSatellites] = useState([]);

  useEffect(() => {
    const mockData = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `Sat-${i + 1}`,
      mission: 'COM',
      altitude: 400 + i * 10,
      launch_date: new Date().toISOString()
    }));
    setSatellites(mockData);
  }, []);

  return (
    <div>
      <h2>Satélites</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Misión</th>
            <th>Altitud</th>
            <th>Lanzamiento</th>
          </tr>
        </thead>
        <tbody>
          {satellites.map(sat => (
            <tr key={sat.id}>
              <td>{sat.id}</td>
              <td>{sat.name}</td>
              <td>{sat.mission}</td>
              <td>{sat.altitude} km</td>
              <td>{new Date(sat.launch_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SatelliteTable;
