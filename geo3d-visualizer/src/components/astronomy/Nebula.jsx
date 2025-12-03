import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Nebula = () => {
  const meshRef = useRef();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('#ff00aa') }, // Pink/Purple
    uColor2: { value: new THREE.Color('#5500ff') }, // Blue/Violet
    uColor3: { value: new THREE.Color('#00ffff') }  // Cyan highlights
  }), []);

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPos;
    varying vec3 vNormal;
    uniform float uTime;

    void main() {
      vUv = uv;
      vPos = position;
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    varying vec3 vPos;
    varying vec3 vNormal;
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;

    // Simplex noise function
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
      // 3D noise effect mapped to sphere surface
      float n1 = snoise(vPos.xy * 0.2 + vec2(uTime * 0.05, 0.0));
      float n2 = snoise(vPos.yz * 0.3 - vec2(0.0, uTime * 0.08));
      float n3 = snoise(vPos.zx * 0.4 + vec2(uTime * 0.03, uTime * 0.03));
      
      float noise = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
      
      // Color mixing based on noise
      vec3 color = mix(uColor1, uColor2, n1 * 0.5 + 0.5);
      color = mix(color, uColor3, n2 * 0.5 + 0.5);
      
      // Fresnel effect for soft edges
      vec3 viewDir = normalize(cameraPosition - vPos);
      float fresnel = dot(viewDir, vNormal);
      float alpha = smoothstep(0.0, 0.6, 1.0 - fresnel);
      
      // Modulate alpha with noise for "gaseous" look
      alpha *= smoothstep(0.3, 0.7, noise + 0.5);
      
      gl_FragColor = vec4(color * 1.5, alpha * 0.8);
    }
  `;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
      meshRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group>
      {/* Main Nebula Cloud */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[15, 64, 64]} />
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

      {/* Inner glow layer */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[8, 32, 32]} />
        <meshBasicMaterial color="#5500ff" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
};

export default Nebula;
