import React from 'react';

function Fence({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Posts */}
      {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
        <mesh key={i} position={[x, 0.4, 0]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial color="#8b6f47" />
        </mesh>
      ))}
      
      {/* Horizontal Rails */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[3.3, 0.08, 0.08]} />
        <meshStandardMaterial color="#8b6f47" />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[3.3, 0.08, 0.08]} />
        <meshStandardMaterial color="#8b6f47" />
      </mesh>
    </group>
  );
}

export default Fence;