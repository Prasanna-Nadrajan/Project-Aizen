import React from 'react';

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.1, 0]}>
      <planeGeometry args={[300, 300]} />
      <meshStandardMaterial color="#4a7c2a" roughness={1} />
    </mesh>
  );
}

export default Ground;