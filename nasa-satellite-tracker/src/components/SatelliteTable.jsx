import React from 'react'
import PropTypes from 'prop-types'

const SatelliteTable = ({ satellites = [], selectedSatellite, onSelect }) => {
  return (
    <div className="satellite-table">
      <h2>Satellite Data</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Altitude (km)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {satellites.map(satellite => (
            <tr 
              key={satellite.id} 
              className={`${selectedSatellite?.id === satellite.id ? 'selected' : ''}`}
              onClick={() => onSelect(satellite)}
            >
              <td>{satellite.name}</td>
              <td>{satellite.latitude?.toFixed(2)}°</td>
              <td>{satellite.longitude?.toFixed(2)}°</td>
              <td>{satellite.altitude?.toFixed(2)}</td>
              <td>
                <span className={`status-badge ${satellite.status?.toLowerCase()}`}>
                  {satellite.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

SatelliteTable.propTypes = {
  satellites: PropTypes.array,
  selectedSatellite: PropTypes.object,
  onSelect: PropTypes.func
}

SatelliteTable.defaultProps = {
  satellites: [],
  onSelect: () => {}
}

export default SatelliteTable