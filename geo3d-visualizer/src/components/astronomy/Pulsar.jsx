import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Pulsar = () => {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            // Rapid rotation
            groupRef.current.rotation.y += 0.3;
            // Wobble
            groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 5) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Neutron Star */}
            <mesh>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={3} />
            </mesh>

            {/* Beams */}
            <mesh position={[0, 5, 0]}>
                <coneGeometry args={[0.1, 10, 32, 1, true]} />
                <meshBasicMaterial color="#00ffff" transparent opacity={0.6} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, -5, 0]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.1, 10, 32, 1, true]} />
                <meshBasicMaterial color="#00ffff" transparent opacity={0.6} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
            </mesh>

            {/* Magnetic field lines */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2, 0.01, 16, 100]} />
                <meshBasicMaterial color="#0088ff" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[4, 0.01, 16, 100]} />
                <meshBasicMaterial color="#0088ff" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
            </mesh>
        </group>
    );
};

export default Pulsar;
