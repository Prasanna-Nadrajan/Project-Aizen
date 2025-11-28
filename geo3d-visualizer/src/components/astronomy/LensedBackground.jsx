import React, { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const LensedBackground = ({ blackHolePosition = [0, 0, 0], rs = 1.5 }) => {
    const { camera } = useThree();

    const uniforms = useMemo(() => ({
        uBlackHolePosition: { value: new THREE.Vector3(...blackHolePosition) },
        uRs: { value: rs },
        uCameraPosition: { value: camera.position },
        uInverseViewMatrix: { value: new THREE.Matrix4().copy(camera.matrixWorld).invert() },
        // For env map: Use a procedural noise fallback or load an HDR
        // envMap: { value: useLoader(RGBELoader, '/path/to/space.hdr') }, // Uncomment if you have an HDR
    }), [blackHolePosition, rs, camera.position]);

    const vertexShader = `
    varying vec2 vUv;
    varying vec3 vWorldPosition;

    void main() {
      vUv = uv;
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

    const fragmentShader = `
    precision highp float;

    uniform vec3 uBlackHolePosition;
    uniform float uRs;
    uniform vec3 uCameraPosition;
    uniform mat4 uInverseViewMatrix;
    // uniform samplerCube uEnvironmentMap; // Uncomment for cubemap sampling

    varying vec2 vUv;
    varying vec3 vWorldPosition;

    // Procedural star noise (fallback if no env map)
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    float stars(vec2 uv, float density) {
      vec2 i = floor(uv * density);
      vec2 f = fract(uv * density);
      float h = hash(i);
      return smoothstep(0.95, 1.0, h - length(f - 0.5)) * (h > 0.99 ? 1.0 : 0.0);
    }

    void main() {
      // Step 1: Ray direction from camera to fragment (world space)
      vec3 rayDir = normalize(vWorldPosition - uCameraPosition);

      // Step 2: Camera to BH vector
      vec3 camToBH = uBlackHolePosition - uCameraPosition;
      float camToBHDist = length(camToBH);
      vec3 bhDir = normalize(camToBH);

      // Step 3: Impact parameter b
      vec3 crossProd = cross(rayDir, camToBH);
      float b = length(crossProd) / camToBHDist;

      // Step 4: Horizon check
      float photonSphere = 1.5 * uRs;
      if (b < uRs) {
        discard; // Pure black horizon
        return;
      }
      if (b < photonSphere) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Swallowed light
        // Optional photon ring glow
        float ring = exp(-pow((b - photonSphere) / 0.01, 2.0)) * 5.0;
        gl_FragColor.rgb += vec3(1.0, 0.8, 0.6) * ring;
        return;
      }

      // Step 5: Deflection angle (strong-field approx)
      float deflection = (4.0 * uRs / b) / (1.0 - pow(photonSphere / b, 2.0) + 0.001); // Avoid div0
      deflection = min(deflection, 3.14159);

      // Step 6: Bend ray (Rodrigues' formula)
      vec3 bendNormal = normalize(cross(rayDir, bhDir));
      vec3 bentDir = rayDir * cos(deflection) +
                     cross(bendNormal, rayDir) * sin(deflection) +
                     bhDir * dot(bhDir, rayDir) * (1.0 - cos(deflection));
      bentDir = normalize(bentDir);

      // Step 7: Sample environment (procedural stars fallback)
      vec3 envColor = vec3(0.0);
      // For cubemap: envColor = textureCube(uEnvironmentMap, bentDir).rgb;
      // Procedural: Warp UV for stars
      vec2 warpedUV = vUv + (bentDir.xy * 0.1); // Simple 2D warp for demo
      envColor += vec3(stars(warpedUV * 100.0, 50.0)); // Twinkly stars

      // Accretion disk hint: Boost orange near bend
      float diskGlow = smoothstep(photonSphere * 2.0, uRs * 2.0, b);
      envColor += vec3(1.0, 0.5, 0.0) * diskGlow * 0.5;

      // Step 8: Magnification
      float mag = 1.0 + (uRs / b) * 2.0;
      envColor *= mag;

      gl_FragColor = vec4(envColor, 1.0);
    }
  `;

    return (
        <mesh>
            <sphereGeometry args={[100, 64, 64]} /> {/* Enclosing sphere */}
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                side={THREE.BackSide} // Render inside
                transparent
                depthWrite={false}
            />
        </mesh>
    );
};

export default LensedBackground;