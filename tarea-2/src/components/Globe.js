import React, { useRef, useEffect } from 'react';
import Globe from 'globe.gl';

const GlobeComponent = () => {
  const globeRef = useRef();

  useEffect(() => {
    const globe = Globe()(globeRef.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png');

    globe.pointOfView({ lat: 0, lng: 0, altitude: 2.5 });
  }, []);

  return (
    <div ref={globeRef} style={{ width: '100%', height: '100vh' }} />
  );
};

export default GlobeComponent;
