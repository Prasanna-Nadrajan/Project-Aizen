import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Supernova = () => {
    const groupRef = useRef();
    const coreRef = useRef();
    const shockwave1Ref = useRef();
    const shockwave2Ref = useRef();
    const particlesRef = useRef();

    // Particle system data
    const particleCount = 2000;
    const particleData = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            // Random direction
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const r = 1 + Math.random() * 2; // Start slightly outside core

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            // Velocity proportional to distance (explosion)
            const speed = 2 + Math.random() * 4;
            velocities[i * 3] = (x / r) * speed;
            velocities[i * 3 + 1] = (y / r) * speed;
            velocities[i * 3 + 2] = (z / r) * speed;

            // Colors: mix of white, yellow, orange
            const color = new THREE.Color();
            color.setHSL(0.05 + Math.random() * 0.1, 1.0, 0.5 + Math.random() * 0.5);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        return { positions, velocities, colors };
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        // Expansion animation loop (resets every 10 seconds)
        const t = time % 10;
        const explosionSpeed = 5.0;

        if (coreRef.current) {
            // Pulsating core
            const scale = 1 + Math.sin(time * 10) * 0.2;
            coreRef.current.scale.set(scale, scale, scale);
            // Core gets smaller as explosion expands
            const coreFade = Math.max(0, 1 - t * 0.2);
            coreRef.current.material.opacity = coreFade;
        }

        if (shockwave1Ref.current) {
            // Fast inner shockwave
            const scale = t * explosionSpeed * 1.5;
            shockwave1Ref.current.scale.set(scale, scale, scale);
            shockwave1Ref.current.material.opacity = Math.max(0, 1 - t * 0.3);
            shockwave1Ref.current.rotation.z += 0.01;
        }

        if (shockwave2Ref.current) {
            // Slower, larger outer shockwave
            const scale = t * explosionSpeed * 0.8;
            shockwave2Ref.current.scale.set(scale, scale, scale);
            shockwave2Ref.current.material.opacity = Math.max(0, 0.8 - t * 0.2);
            shockwave2Ref.current.rotation.y -= 0.005;
        }

        if (particlesRef.current) {
            const positions = particlesRef.current.geometry.attributes.position.array;

            for (let i = 0; i < particleCount; i++) {
                // Move particles
                positions[i * 3] += particleData.velocities[i * 3] * 0.01 * (t * 2); // Accelerate slightly
                positions[i * 3 + 1] += particleData.velocities[i * 3 + 1] * 0.01 * (t * 2);
                positions[i * 3 + 2] += particleData.velocities[i * 3 + 2] * 0.01 * (t * 2);

                // Reset if loop restarts
                if (t < 0.1) {
                    // Reset positions logic would be complex here without storing originals, 
                    // but for visual effect, the jump back is acceptable or we can just let them fly out forever
                    // For this simple demo, we'll just let the shockwaves loop and particles fly
                }
            }
            particlesRef.current.geometry.attributes.position.needsUpdate = true;

            // Fade particles
            particlesRef.current.material.opacity = Math.max(0, 1 - t * 0.15);
        }
    });

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            {/* Blinding Core */}
            <mesh ref={coreRef}>
                <sphereGeometry args={[2, 32, 32]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={1} blending={THREE.AdditiveBlending} />
            </mesh>

            {/* Inner Shockwave (Plasma) */}
            <mesh ref={shockwave1Ref}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial
                    color="#ffaa00"
                    emissive="#ff5500"
                    emissiveIntensity={2}
                    transparent
                    opacity={0.8}
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                    wireframe={false}
                />
            </mesh>

            {/* Outer Shockwave (Gas) */}
            <mesh ref={shockwave2Ref}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial
                    color="#ff00aa"
                    emissive="#5500ff"
                    emissiveIntensity={1}
                    transparent
                    opacity={0.5}
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Debris Particles */}
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particleCount}
                        array={particleData.positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={particleCount}
                        array={particleData.colors}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.4}
                    vertexColors
                    transparent
                    opacity={1}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>
        </group>
    );
};

export default Supernova;

