import React from 'react';
import { useGLTF } from '@react-three/drei';

const BlackHole = () => {
  // Ensure you have black_hole.glb in your public/models/ folder
  const { scene } = useGLTF('/models/black_hole.glb');

  return (
    <primitive
      object={scene}
      scale={[2, 2, 2]} // Adjust scale as needed based on your model size
      rotation={[0, 0, 0]}
    />
  );
};

// Preload the model for smoother loading
useGLTF.preload('/models/black_hole.glb');

export default BlackHole;