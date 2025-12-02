import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

function House({ position = [0, 0, 0], rotation = [0, 0, 0], wallColor = "#f2e9e4", roofColor = "#4a4e69" }) {
  const [isHovered, setIsHovered] = useState(false);
  const houseGroup = useRef();

  return (
    <group
      position={position}
      rotation={rotation}
      ref={houseGroup}
      onPointerOver={(e) => { e.stopPropagation(); setIsHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setIsHovered(false); }}
    >
      {/* --- Main Structure --- */}
      {/* Base Foundation */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.4, 3.2]} />
        <meshStandardMaterial color="#7f7f7f" />
      </mesh>

      {/* Steps */}
      <mesh position={[0, 0.1, 1.8]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.2, 0.6]} />
        <meshStandardMaterial color="#8d99ae" />
      </mesh>
      <mesh position={[0, 0.3, 1.7]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.2, 0.4]} />
        <meshStandardMaterial color="#8d99ae" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 1.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 2.6, 3]} />
        <meshStandardMaterial color={isHovered ? "#ffe5d9" : wallColor} roughness={0.8} />
      </mesh>

      {/* --- Roof --- */}
      <group position={[0, 3, 0]}>
        {/* Main Roof Prism */}
        <mesh position={[0, 0.75, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0, 2.5, 1.5, 4]} />
          <meshStandardMaterial color={roofColor} roughness={0.6} />
        </mesh>

        {/* Chimney */}
        <mesh position={[0.8, 0.8, 0.8]} castShadow>
          <boxGeometry args={[0.4, 1.2, 0.4]} />
          <meshStandardMaterial color="#7f5539" />
        </mesh>
        <mesh position={[0.8, 1.45, 0.8]} castShadow>
          <boxGeometry args={[0.5, 0.1, 0.5]} />
          <meshStandardMaterial color="#5c3a21" />
        </mesh>
      </group>

      {/* --- Door Area --- */}
      <group position={[0, 1.3, 1.51]}>
        {/* Door Frame */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.0, 2.1, 0.05]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        {/* Door */}
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[0.8, 2.0, 0.05]} />
          <meshStandardMaterial color="#5c3a21" />
        </mesh>
        {/* Knob */}
        <mesh position={[0.3, 0, 0.06]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* --- Windows --- */}
      {/* Front Left Window */}
      <Window position={[-0.8, 2, 1.52]} />
      {/* Front Right Window */}
      <Window position={[0.8, 2, 1.52]} />

      {/* Side Window Left */}
      <group rotation={[0, -Math.PI / 2, 0]}>
        <Window position={[0, 2, 1.52]} />
      </group>

      {/* Side Window Right */}
      <group rotation={[0, Math.PI / 2, 0]}>
        <Window position={[0, 2, 1.52]} />
      </group>

    </group>
  );
}

// Helper component for detailed windows
function Window({ position }) {
  return (
    <group position={position}>
      {/* Frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Glass */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.7, 0.7, 0.05]} />
        <meshStandardMaterial color="#87ceeb" metalness={0.9} roughness={0.05} />
      </mesh>
      {/* Sill */}
      <mesh position={[0, -0.45, 0.05]}>
        <boxGeometry args={[0.9, 0.1, 0.15]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Crossbars */}
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[0.7, 0.05, 0.02]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[0.05, 0.7, 0.02]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

export default House;