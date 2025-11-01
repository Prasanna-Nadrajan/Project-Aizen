import { useEffect, useState } from 'react';
import Building from './Buildings';
import GroundPlane from './GroundPlane';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Scene() {
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    fetch('/src/data/buildings.geojson')
      .then(res => res.json())
      .then(data => setFeatures(data.features));
  }, []);

  return (
    <Canvas camera={{ position: [0, 50, 100], fov: 80 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={1} />
      <GroundPlane />
      {features.map((feature, idx) => (
        <Building key={idx} feature={feature} />
      ))}
      <OrbitControls />
    </Canvas>
  );
}

export default Scene;