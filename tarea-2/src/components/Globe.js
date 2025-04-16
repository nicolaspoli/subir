import React, { useRef, useEffect } from 'react';
import Globe from 'globe.gl';
import * as topojson from 'topojson-client';

const GlobeComponent = () => {
  const globeRef = useRef();

  useEffect(() => {
    if (!globeRef.current) return;
    const globe = Globe()(globeRef.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .pointOfView({ lat: 0, lng: 0, altitude: 2.5 })
      .showAtmosphere(true)
      .atmosphereColor('lightskyblue')
      .atmosphereAltitude(0.25);
    fetch('//unpkg.com/world-atlas/land-110m.json')
      .then((res) => res.json())
      .then((landData) => {
        const { features } = topojson.feature(landData, landData.objects.land);
        globe.polygonsData(features)
          .polygonCapColor(() => 'rgba(255,255,255,0.1)')
          .polygonSideColor(() => 'rgba(0, 100, 255, 0.15)')
          .polygonStrokeColor(() => '#111')
          .polygonAltitude(0.01);
      });


    // no entindi al final si esto es base un ejemplo lo dejo por si acaso
    const baseStations = [
      {
        name: 'Goldstone DSCC',
        lat: 35 + 25 / 60 + 36 / 3600,
        lng: -(116 + 53 / 60 + 24 / 3600),
        type: 'station'
      },
      {
        name: 'Madrid DSCC',
        lat: 40 + 25 / 60 + 53 / 3600,
        lng: -(4 + 14 / 60 + 53 / 3600),
        type: 'station'
      },
      {
        name: 'Canberra DSCC',
        lat: -(35 + 24 / 60 + 5 / 3600),
        lng: 148 + 58 / 60 + 54 / 3600,
        type: 'station'
      }
    ];

    const updateGlobeData = (data) => {
      globe.pointsData(data)
        .pointLat((d) => d.lat)
        .pointLng((d) => d.lng)
        .pointAltitude((d) => d.type === 'station' ? 0.1 : 0)
        .pointRadius((d) => d.type === 'station' ? 0.3 : 0.25)
        .pointColor((d) => d.type === 'station' ? 'red' : 'orange');

      globe.labelsData(data)
        .labelLat((d) => d.lat)
        .labelLng((d) => d.lng)
        .labelText((d) => d.type === 'station' ? d.name : d.satellite_id)
        .labelColor((d) => d.type === 'station' ? 'white' : 'orange')
        .labelSize((d) => d.type === 'station' ? 1.5 : 1.2)
        .labelDotRadius((d) => d.type === 'station' ? 0.4 : 0.2)
        .labelAltitude((d) => d.type === 'station' ? 0.12 : 0.02);
    };

    updateGlobeData(baseStations);
    const ws = new WebSocket('wss://tarea-2.2025-1.tallerdeintegracion.cl/connect');

    ws.onopen = () => {
      console.log('WebSocket conectado');
      ws.send(JSON.stringify({
        type: "AUTH",
        name: "Poli",
        student_number: "19624468"
      }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'POSITION_UPDATE') {
        const satellites = message.satellites.map(sat => ({
          satellite_id: sat.satellite_id,
          lat: sat.position.lat,
          lng: sat.position.long,
          type: 'satellite'
        }));

        const combinedData = [...baseStations, ...satellites];
        updateGlobeData(combinedData);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket cerrado');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div 
      ref={globeRef} 
      className="globe-container" 
      style={{ width: '100%', height: '100vh' }} 
    />
  );
};

export default GlobeComponent;
