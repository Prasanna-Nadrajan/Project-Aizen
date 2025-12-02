import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

const AccretionDisk = () => {
  const meshRef = useRef();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorInner: { value: new THREE.Color('#fffeb3') }, // Bright yellow-white
    uColorMid: { value: new THREE.Color('#ff8c00') },   // Deep orange
    uColorOuter: { value: new THREE.Color('#550000') }  // Dark red
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
        uniform vec3 uColorMid;
        uniform vec3 uColorOuter;

        // Simplex noise function
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy) );
            vec2 x0 = v - i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod289(i);
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
            m = m*m ;
            m = m*m ;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }

        void main() {
            float r = length(vPos.xy);
            float angle = atan(vPos.y, vPos.x);
            
            // Swirling motion
            float noiseVal = snoise(vec2(angle * 6.0 - uTime * 2.0 + r * 3.0, r * 3.0 - uTime));
            
            // Radius normalization (inner radius ~2.6, outer ~6.0 based on geometry)
            float t = (r - 2.6) / 3.4;
            t = clamp(t, 0.0, 1.0);
            
            vec3 baseColor = mix(uColorInner, uColorMid, smoothstep(0.0, 0.3, t));
            baseColor = mix(baseColor, uColorOuter, smoothstep(0.3, 1.0, t));
            
            // Add noise detail
            float detail = noiseVal * 0.5 + 0.5;
            vec3 finalColor = baseColor * (0.8 + detail * 1.5);
            
            // Soft edges
            float alpha = smoothstep(0.0, 0.1, t) * smoothstep(1.0, 0.8, t);
            
            // Boost brightness for inner part
            finalColor *= (1.2 + smoothstep(0.2, 0.0, t) * 3.0);

            gl_FragColor = vec4(finalColor, alpha);
        }
    `;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[2.6, 6.0, 128]} />
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

const BlackHole = () => {
  return (
    <group>
      {/* Event Horizon (The Black Sphere) */}
      <mesh>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Accretion Disk */}
      <AccretionDisk />

      {/* Warping/Lensing Effect Mesh (Outer Shell) */}
      {/* This invisible sphere acts as a lens, bending the background stars */}
      <mesh>
        {/* <sphereGeometry args={[4, 64, 64]} /> */}
        <MeshTransmissionMaterial
          backside={true}
          samples={4}
          thickness={1}
          roughness={0}
          transmission={1}
          ior={1.5}
          chromaticAberration={0.3}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.1}
          temporalDistortion={0.0}
          color="#ffffff"
        />
      </mesh>
    </group>
  );
};

export default BlackHole;