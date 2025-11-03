import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

function House() {
  const houseRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  useFrame(() => {
    if (houseRef.current && isHovered) {
      houseRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group 
      ref={houseRef}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      {/* Main House Body */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color={isHovered ? "#f59e42" : "#e88832"} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[2.3, 1.5, 4]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.8, 1.51]} castShadow>
        <boxGeometry args={[0.8, 1.6, 0.1]} />
        <meshStandardMaterial color="#5c3a21" />
      </mesh>

      {/* Door Knob */}
      <mesh position={[0.3, 0.8, 1.56]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Left Window */}
      <mesh position={[-0.9, 1.8, 1.51]}>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} />
      </mesh>

      {/* Right Window */}
      <mesh position={[0.9, 1.8, 1.51]}>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} />
      </mesh>

      {/* Window Frame Left - Horizontal */}
      <mesh position={[-0.9, 1.8, 1.52]}>
        <boxGeometry args={[0.65, 0.05, 0.08]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Window Frame Left - Vertical */}
      <mesh position={[-0.9, 1.8, 1.52]}>
        <boxGeometry args={[0.05, 0.65, 0.08]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Window Frame Right - Horizontal */}
      <mesh position={[0.9, 1.8, 1.52]}>
        <boxGeometry args={[0.65, 0.05, 0.08]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Window Frame Right - Vertical */}
      <mesh position={[0.9, 1.8, 1.52]}>
        <boxGeometry args={[0.05, 0.65, 0.08]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Chimney */}
      <mesh position={[1.2, 4, -0.5]} castShadow>
        <boxGeometry args={[0.5, 1.2, 0.5]} />
        <meshStandardMaterial color="#8b0000" />
      </mesh>
    </group>
  );
}

export default House;