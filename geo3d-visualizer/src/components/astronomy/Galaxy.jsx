import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Galaxy = () => {
    const points = useRef();

    const parameters = {
        count: 50000, // Particles for the spiral arms
        coreCount: 20000, // Extra particles for the dense core
        size: 0.015,
        radius: 10,
        branches: 2,
        spin: 1,
        randomness: 0.3,
        randomnessPower: 3,
        insideColor: '#ffaa33',
        outsideColor: '#3366ff',
    };

    const particles = useMemo(() => {
        const totalCount = parameters.count + parameters.coreCount;
        const positions = new Float32Array(totalCount * 3);
        const colors = new Float32Array(totalCount * 3);
        const colorInside = new THREE.Color(parameters.insideColor);
        const colorOutside = new THREE.Color(parameters.outsideColor);

        // Generate Spiral Arms
        for (let i = 0; i < parameters.count; i++) {
            const i3 = i * 3;
            const radius = Math.random() * parameters.radius;

            let spinAngle = radius * parameters.spin;
            // Flatten spin near center for bar effect
            if (radius < 2) spinAngle *= 0.2;

            const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

            const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
            const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * (radius * 0.5);
            const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

            positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
            positions[i3 + 1] = randomY;
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

            const mixedColor = colorInside.clone();
            mixedColor.lerp(colorOutside, radius / parameters.radius);

            mixedColor.r += (Math.random() - 0.5) * 0.1;
            mixedColor.b += (Math.random() - 0.5) * 0.1;

            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
        }

        // Generate Dense Core (replacing the solid sphere)
        for (let i = parameters.count; i < totalCount; i++) {
            const i3 = i * 3;
            // Generate particles in a small, dense ball/disk at the center
            const r = Math.pow(Math.random(), 2) * 2.5; // Biased towards center, max radius 2.5
            const theta = Math.random() * Math.PI * 2;
            const phi = (Math.random() - 0.5) * Math.PI * 0.5; // Flattened sphere

            // Convert spherical to cartesian, but flattened
            const x = r * Math.cos(theta) * Math.cos(phi);
            const y = r * Math.sin(phi) * 0.5; // Flatten on Y axis
            const z = r * Math.sin(theta) * Math.cos(phi);

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            // Core is bright and warm
            colors[i3] = colorInside.r + (Math.random() * 0.2);
            colors[i3 + 1] = colorInside.g + (Math.random() * 0.2);
            colors[i3 + 2] = colorInside.b + (Math.random() * 0.2);
        }

        return { positions, colors };
    }, []);

    useFrame((state) => {
        if (points.current) {
            points.current.rotation.y = state.clock.getElapsedTime() * 0.02;
        }
    });

    return (
        <group rotation={[Math.PI / 6, 0, 0]}>
            <points ref={points}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={parameters.count + parameters.coreCount}
                        array={particles.positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={parameters.count + parameters.coreCount}
                        array={particles.colors}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={parameters.size}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    vertexColors={true}
                    transparent
                    opacity={0.8}
                />
            </points>
        </group>
    );
};

export default Galaxy;
