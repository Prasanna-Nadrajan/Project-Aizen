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
        uColorInner: { value: new THREE.Color('#ffaa00') }, // Warmer inner color
        uColorOuter: { value: new THREE.Color('#aa00ff') }  // Cooler outer color
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
    
    // Simplex noise function (simplified)
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        return 105.0 * dot( m*m, vec3( dot(p,x0), dot(p.yz,x12.xy), dot(p.z,x12.zw) ) );
    }

    void main() {
      float r = length(vPos.xy);
      float angle = atan(vPos.y, vPos.x);
      
      // Doppler beaming effect (brighter on one side)
      float doppler = 1.0 + 0.5 * sin(angle); 

      // Complex noise pattern for accretion flow
      float noise = snoise(vec2(angle * 5.0 - uTime * 2.0, r * 2.0 - uTime));
      float noise2 = snoise(vec2(angle * 10.0 - uTime * 3.0, r * 5.0));
      
      // Color gradient based on radius and temperature
      vec3 color = mix(uColorInner, uColorOuter, smoothstep(1.0, 4.0, r));
      
      // Add turbulence and detail
      color += vec3(noise * 0.3 + noise2 * 0.1);
      
      // Apply Doppler beaming
      color *= doppler;

      // Intense brightness at the center
      color *= 1.5 + 2.0 / (r * r);
      
      // Soft edges
      float alpha = smoothstep(4.5, 3.5, r) * smoothstep(0.8, 1.2, r);
      
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
            <ringGeometry args={[1.0, 4.5, 128]} />
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
                <sphereGeometry args={[0.95, 64, 64]} />
                <meshBasicMaterial color="#000000" />
            </mesh>

            {/* Blinding Central Glow */}
            <mesh>
                <sphereGeometry args={[1.2, 32, 32]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
            </mesh>

            {/* Large Halo */}
            <mesh>
                <sphereGeometry args={[8, 32, 32]} />
                <meshBasicMaterial color="#2200ff" transparent opacity={0.05} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
            </mesh>

            <QuasarDisk />

            <QuasarJet direction={1} />
            <QuasarJet direction={-1} />
        </group>
    );
};

export default Quasar;
