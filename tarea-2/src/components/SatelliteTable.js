import React from 'react';

// Función para generar datos ficticios de cada satélite
const generateSatelliteInfo = (name, index) => {
  const missions = ['COM', 'NAV', 'OBS', 'SCI'];
  const types = ['Geo', 'LEO', 'MEO'];
  return {
    id: index + 1,
    flag: '🛰️', // Puedes reemplazar esto por una imagen si prefieres
    name,
    mission: missions[index % missions.length],
    type: types[index % types.length],
    power: `${1000 + index * 50} W`,
    altitude: `${350 + (index * 5)} km`,
    lifespan: `${5 + (index % 10)} años`,
  };
};

const SatelliteTable = ({ data }) => {
  const satellites = data?.map((name, index) => generateSatelliteInfo(name, index)) || [];

  return (
    <div>
      <h2>Satélites</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Bandera</th>
            <th>Nombre del Satélite</th>
            <th>Misión</th>
            <th>Tipo</th>
            <th>Potencia</th>
            <th>Altitud</th>
            <th>Vida útil</th>
          </tr>
        </thead>
        <tbody>
          {satellites.map((sat) => (
            <tr key={sat.id}>
              <td>{sat.id}</td>
              <td>{sat.flag}</td>
              <td>{sat.name}</td>
              <td>{sat.mission}</td>
              <td>{sat.type}</td>
              <td>{sat.power}</td>
              <td>{sat.altitude}</td>
              <td>{sat.lifespan}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SatelliteTable;
