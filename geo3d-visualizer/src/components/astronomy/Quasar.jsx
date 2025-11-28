import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const QuasarJet = ({ direction }) => {
    const meshRef = useRef();

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColorCore: { value: new THREE.Color('#ffffff') },
        uColorGlow: { value: new THREE.Color('#00ffff') }
    }), []);

    const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPos;
    uniform float uTime;
    
    void main() {
      vUv = uv;
      vPos = position;
      
      // Add some wobble to the jet
      vec3 pos = position;
      float noise = sin(pos.y * 2.0 - uTime * 5.0) * 0.1;
      pos.x += noise * (pos.y / 10.0);
      pos.z += cos(pos.y * 2.0 - uTime * 5.0) * 0.1 * (pos.y / 10.0);
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

    const fragmentShader = `
    varying vec2 vUv;
    varying vec3 vPos;
    uniform float uTime;
    uniform vec3 uColorCore;
    uniform vec3 uColorGlow;
    
    void main() {
      // Distance from center axis
      float r = length(vPos.xz);
      
      // Energy pulses moving up
      float pulse = sin(vPos.y * 1.5 - uTime * 8.0) * 0.5 + 0.5;
      float pulse2 = cos(vPos.y * 3.0 - uTime * 12.0) * 0.3 + 0.7;
      
      // Core intensity
      float core = smoothstep(0.6, 0.0, r);
      
      // Glow intensity
      float glow = smoothstep(1.5, 0.2, r) * 0.5;
      
      // Fade out at the end
      float alpha = smoothstep(15.0, 5.0, abs(vPos.y));
      
      vec3 finalColor = mix(uColorGlow, uColorCore, core);
      finalColor *= (pulse * pulse2 * 2.0 + 1.0);
      
      gl_FragColor = vec4(finalColor, alpha * (core + glow));
    }
  `;

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    return (
        <mesh ref={meshRef} position={[0, direction * 7.5, 0]} rotation={[direction === 1 ? 0 : Math.PI, 0, 0]}>
            {/* Tapered cylinder for the jet */}
            <cylinderGeometry args={[0.2, 1.5, 15, 32, 32, true]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </mesh>
    );
};

const QuasarDisk = () => {
    const meshRef = useRef();

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColorInner: { value: new THREE.Color('#ffffff') },
        uColorOuter: { value: new THREE.Color('#4400ff') }
    }), []);

    const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPos;
    void main() {
      vUv = uv;
      vPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

    const fragmentShader = `
    varying vec2 vUv;
    varying vec3 vPos;
    uniform float uTime;
    uniform vec3 uColorInner;
    uniform vec3 uColorOuter;
    
    void main() {
      float r = length(vPos.xy);
      float angle = atan(vPos.y, vPos.x);
      
      // Fast swirling noise
      float noise = sin(angle * 10.0 - uTime * 5.0 + r * 5.0);
      float noise2 = cos(angle * 20.0 - uTime * 8.0 + r * 10.0);
      
      // Bright core transition
      vec3 color = mix(uColorInner, uColorOuter, smoothstep(1.0, 3.5, r));
      
      // Add turbulence
      color += vec3(noise + noise2) * 0.2;
      
      // Intense brightness
      color *= 2.0;
      
      // Soft edges
      float alpha = smoothstep(4.0, 3.0, r) * smoothstep(0.8, 1.2, r);
      
      gl_FragColor = vec4(color, alpha);
    }
  `;

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    return (
        <mesh ref={meshRef} rotation={[Math.PI / 2.5, 0, 0]}>
            <ringGeometry args={[1.0, 4, 128]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </mesh>
    );
};

const Quasar = () => {
    return (
        <group>
            {/* Central Supermassive Black Hole (The "Eye") */}
            <mesh>
                <sphereGeometry args={[0.9, 64, 64]} />
                <meshBasicMaterial color="#000000" />
            </mesh>

            {/* Blinding Central Glow */}
            <mesh>
                <sphereGeometry args={[1.1, 32, 32]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
            </mesh>

            {/* Large Halo */}
            <mesh>
                <sphereGeometry args={[6, 32, 32]} />
                <meshBasicMaterial color="#2200ff" transparent opacity={0.1} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
            </mesh>

            <QuasarDisk />

            <QuasarJet direction={1} />
            <QuasarJet direction={-1} />
        </group>
    );
};

export default Quasar;
