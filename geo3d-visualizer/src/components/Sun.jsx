import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function Sun() {
  const sunRef = useRef();
  
  useFrame(({ clock }) => {
    if (sunRef.current) {
      sunRef.current.position.y = 8 + Math.sin(clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <group ref={sunRef}>
      <mesh position={[-8, 8, -8]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#ffd700" />
      </mesh>
      <pointLight position={[-8, 8, -8]} intensity={1.5} color="#ffd700" />
    </group>
  );
}

export default Sun;