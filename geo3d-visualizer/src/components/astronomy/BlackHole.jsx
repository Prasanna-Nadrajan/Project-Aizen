import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
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
      float noiseVal = snoise(vec2(angle * 4.0 - uTime * 2.0 + r * 2.0, r * 2.0 - uTime));
      float noiseVal2 = snoise(vec2(angle * 8.0 - uTime * 3.0, r * 5.0));
      
      // Color gradient based on radius
      // Inner (1.5) -> Outer (4.0)
      float t = (r - 1.5) / 2.5;
      
      vec3 baseColor = mix(uColorInner, uColorMid, smoothstep(0.0, 0.4, t));
      baseColor = mix(baseColor, uColorOuter, smoothstep(0.4, 1.0, t));
      
      // Add noise detail
      float detail = (noiseVal + noiseVal2 * 0.5) * 0.5 + 0.5;
      vec3 finalColor = baseColor * (0.8 + detail * 1.2);
      
      // Boost brightness for inner part
      finalColor *= (1.0 + smoothstep(0.5, 0.0, t) * 2.0);
      
      // Soft edges
      float alpha = smoothstep(0.0, 0.1, t) * smoothstep(1.0, 0.8, t);
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    return (
        <mesh ref={meshRef} rotation={[Math.PI / 2.3, 0, 0]}>
            <ringGeometry args={[1.6, 4.5, 128]} />
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

const WarpedDisk = () => {
    const meshRef = useRef();

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColorInner: { value: new THREE.Color('#fffeb3') },
        uColorMid: { value: new THREE.Color('#ff8c00') },
        uColorOuter: { value: new THREE.Color('#550000') }
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
    
    // Simplex noise function (same as above)
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
      float noiseVal = snoise(vec2(angle * 4.0 - uTime * 2.0 + r * 2.0, r * 2.0 - uTime));
      
      float t = (r - 1.5) / 2.5;
      
      vec3 baseColor = mix(uColorInner, uColorMid, smoothstep(0.0, 0.4, t));
      baseColor = mix(baseColor, uColorOuter, smoothstep(0.4, 1.0, t));
      
      float detail = noiseVal * 0.5 + 0.5;
      vec3 finalColor = baseColor * (0.8 + detail * 1.2);
      finalColor *= (1.0 + smoothstep(0.5, 0.0, t) * 2.0);
      
      // MASKING for the "Hump" effect
      // We are rendering a vertical ring.
      // We want to hide the parts that are "equatorial" (y close to 0 in local space? No, x close to 0?)
      // In local space of the ring, it's flat on XY.
      // When rotated 90deg, Y becomes World Y.
      // We want to hide the parts where Y is small (close to the horizontal disk).
      
      float verticalMask = smoothstep(0.5, 2.0, abs(vPos.y)); 
      
      float alpha = smoothstep(0.0, 0.1, t) * smoothstep(1.0, 0.8, t);
      alpha *= verticalMask; // Apply the mask
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    return (
        // Rotated 90 degrees to be vertical, facing the camera roughly
        <mesh ref={meshRef} rotation={[0, 0, 0]}>
            {/* We rotate the group or the mesh to make it vertical relative to the main disk */}
            <ringGeometry args={[1.55, 4.2, 128]} />
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
                <sphereGeometry args={[1.5, 64, 64]} />
                <meshBasicMaterial color="#000000" />
            </mesh>

            {/* Photon Ring (Glowing Edge) */}
            <mesh>
                <sphereGeometry args={[1.52, 64, 64]} />
                <meshBasicMaterial color="#ffaa00" transparent opacity={0.2} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
            </mesh>

            {/* Main Horizontal Accretion Disk */}
            <AccretionDisk />

            {/* Warped Vertical Disk (The "Halo" Arches) */}
            {/* We rotate this one to be vertical */}
            <group rotation={[0, Math.PI / 2, 0]}>
                {/* Actually, we want it to face the camera? 
             If the camera is at [8, 6, 8], we want the "vertical" ring to be perpendicular to the view vector?
             For a static "Gargantua" look, we usually align it with the camera's view axis projected on XZ.
             Let's just align it with the Z axis for now, or rotate it to look good from the default camera position.
         */}
                <group rotation={[0, Math.PI / 4, 0]}>
                    <WarpedDisk />
                </group>
            </group>
        </group>
    );
};

export default BlackHole;
