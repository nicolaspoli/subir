import React, { useRef, useEffect } from 'react';
import Globe from 'globe.gl';
import * as topojson from 'topojson-client';

const GlobeComponent = () => {
  const globeRef = useRef();

  useEffect(() => {
    const globe = Globe()(globeRef.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .pointOfView({ lat: 0, lng: 0, altitude: 2.5 })
      .showAtmosphere(true)
      .atmosphereColor('lightskyblue')
      .atmosphereAltitude(0.25);

    // Cargar países
    fetch('//unpkg.com/world-atlas/land-110m.json')
      .then(res => res.json())
      .then(landData => {
        const { features } = topojson.feature(landData, landData.objects.land);
        globe.polygonsData(features)
          .polygonCapColor(() => 'rgba(255,255,255,0.1)')
          .polygonSideColor(() => 'rgba(0, 100, 255, 0.15)')
          .polygonStrokeColor(() => '#111')
          .polygonAltitude(0.01);
      });

    // Estaciones con puntos + etiquetas
    const stations = [
      {
        name: 'Goldstone DSCC',
        lat: 35 + 25 / 60 + 36 / 3600,
        lng: -(116 + 53 / 60 + 24 / 3600)
      },
      {
        name: 'Madrid DSCC',
        lat: 40 + 25 / 60 + 53 / 3600,
        lng: -(4 + 14 / 60 + 53 / 3600)
      },
      {
        name: 'Canberra DSCC',
        lat: -(35 + 24 / 60 + 5 / 3600),
        lng: 148 + 58 / 60 + 54 / 3600
      }
    ];

    globe
      .pointsData(stations)
      .pointLat(d => d.lat)
      .pointLng(d => d.lng)
      .pointColor(() => 'red')
      .pointAltitude(0.1)
      .pointRadius(0.15);

    globe
      .labelsData(stations)
      .labelLat(d => d.lat)
      .labelLng(d => d.lng)
      .labelText(d => d.name)
      .labelColor(() => 'white')
      .labelSize(1.2)
      .labelDotRadius(0.4)
      .labelAltitude(0.12);
  }, []);

  return (
    <div className="globe-container" ref={globeRef} />
  );
};

export default GlobeComponent;
