import React from 'react';

function Tree({ position }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.25, 1, 8]} />
        <meshStandardMaterial color="#6b4423" />
      </mesh>
      
      {/* Leaves (3 spheres stacked) */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color="#2d5016" />
      </mesh>
      <mesh position={[0, 1.7, 0]} castShadow>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#3a6b1f" />
      </mesh>
      <mesh position={[0, 2, 0]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#4a8527" />
      </mesh>
    </group>
  );
}

export default Tree;