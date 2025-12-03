import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

const Nebula = () => {
  const nebulaRef = useRef();
  // Ensure you have nebula.glb in your public/models/ folder
  const { scene } = useGLTF('/models/nebula.glb');

  useFrame((state, delta) => {
    if (nebulaRef.current) {
      // Very slow, majestic rotation for the nebula
      nebulaRef.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <primitive
      ref={nebulaRef}
      object={scene}
      scale={[8, 8, 8]} // Nebulae are massive
      rotation={[0, 0, 0]}
    />
  );
};

useGLTF.preload('/models/nebula.glb');

export default Nebula;