import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import House from './House';
import Ground from './Ground';
import Tree from './Tree';
import Fence from './Fence';
import Cloud from './Cloud';
import Sun from './Sun';
import BlackHole from './astronomy/BlackHole';
import Quasar from './astronomy/Quasar';
import Pulsar from './astronomy/Pulsar';
import Galaxy from './astronomy/Galaxy';
import LensedBackground from './astronomy/LensedBackground'; // NEW: Import lensing

function Scene() {
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [selectedObject, setSelectedObject] = useState('house');

  const sceneSettings = {
    day: {
      bgColor: '#87ceeb',
      ambientIntensity: 0.6,
      sunIntensity: 1.5,
      showStars: false
    },
    sunset: {
      bgColor: '#ff6b35',
      ambientIntensity: 0.4,
      sunIntensity: 1.2,
      showStars: false
    },
    night: {
      bgColor: '#0a1128',
      ambientIntensity: 0.2,
      sunIntensity: 0.3,
      showStars: true
    },
    space: {
      bgColor: '#000000',
      ambientIntensity: 0.1,
      sunIntensity: 0,
      showStars: true
    }
  };

  const isSpaceObject = selectedObject !== 'house';
  const currentSettings = isSpaceObject ? sceneSettings.space : sceneSettings[timeOfDay];

  return (
    <>
      {/* Control Panel */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        padding: '20px',
        borderRadius: '12px',
        fontFamily: 'system-ui, sans-serif',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        zIndex: 10,
        minWidth: '200px'
      }}>
        <h3 style={{
          margin: '0 0 15px 0',
          fontSize: '18px',
          color: '#333',
          fontWeight: 600
        }}>
          Scene Controls
        </h3>

        <div style={{ marginBottom: '15px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            color: '#555',
            fontWeight: 500
          }}>
            Select Object
          </label>
          <select
            value={selectedObject}
            onChange={(e) => setSelectedObject(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '2px solid #e0e0e0',
              fontSize: '14px',
              cursor: 'pointer',
              background: 'white',
              marginBottom: '10px'
            }}
          >
            <option value="house">🏡 House</option>
            <option value="black_hole">⚫ Black Hole</option>
            <option value="quasar">✨ Quasar</option>
            <option value="pulsar">💫 Pulsar</option>
            <option value="galaxy">🌌 Galaxy</option>
          </select>
        </div>

        {!isSpaceObject && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              color: '#555',
              fontWeight: 500
            }}>
              Time of Day
            </label>
            <select
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '2px solid #e0e0e0',
                fontSize: '14px',
                cursor: 'pointer',
                background: 'white'
              }}
            >
              <option value="day">☀️ Day</option>
              <option value="sunset">🌅 Sunset</option>
              <option value="night">🌙 Night</option>
            </select>
          </div>
        )}

        <div style={{
          marginTop: '20px',
          paddingTop: '15px',
          borderTop: '2px solid #e0e0e0',
          fontSize: '12px',
          color: '#666',
          lineHeight: '1.6'
        }}>
          <p style={{ margin: '0 0 6px 0' }}><strong>Controls:</strong></p>
          <p style={{ margin: '0 0 4px 0' }}>• Drag to rotate view</p>
          <p style={{ margin: '0 0 4px 0' }}>• Scroll to zoom</p>
          <p style={{ margin: '0' }}>• Hover over objects</p>
        </div>
      </div>

      {/* Title */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '30px',
        color: 'white',
        fontFamily: 'system-ui, sans-serif',
        zIndex: 10,
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '36px',
          fontWeight: 700
        }}>
          {isSpaceObject ? 'Cosmic Viewer' : 'My 3D House'}
        </h1>
        <p style={{
          margin: '5px 0 0 0',
          fontSize: '16px',
          opacity: 0.9
        }}>
          {isSpaceObject ? 'Exploring the Universe' : 'Built with React + Three.js'}
        </p>
      </div>

      {/* Canvas */}
      <Canvas
        shadows
        camera={{ position: [8, 6, 8], fov: 50 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={[currentSettings.bgColor]} />

        {(currentSettings.showStars || isSpaceObject) && <Stars radius={100} depth={50} count={isSpaceObject ? 10000 : 5000} factor={4} saturation={0} fade speed={1} />}

        <ambientLight intensity={currentSettings.ambientIntensity} />

        {!isSpaceObject && (
          <>
            <Sun />
            <directionalLight
              position={[5, 10, 5]}
              intensity={currentSettings.sunIntensity}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />

            <House />
            <Ground />

            <Tree position={[-5, 0, -3]} />
            <Tree position={[5, 0, -4]} />
            <Tree position={[-4, 0, 4]} />
            <Tree position={[-3, 0, 4]} />
            <Tree position={[-6, 0, 3]} />
            <Tree position={[-4, 0, 5]} />
            <Tree position={[4, 0, 5]} />
            <Tree position={[3, 0, 2]} />
            <Tree position={[6, 0, 3]} />
            <Tree position={[2, 0, 5]} />

            <Fence position={[0, 0, 4]} rotation={[0, 0, 0]} />
            <Fence position={[-4, 0, 0]} rotation={[0, Math.PI / 2, 0]} />

            {timeOfDay !== 'night' && (
              <>
                <Cloud position={[4, 6, -6]} />
                <Cloud position={[-5, 7, -8]} />
                <Cloud position={[6, 6.5, -5]} />
                <Cloud position={[7, 8, -1]} />
                <Cloud position={[5, 3, -2]} />
                <Cloud position={[6, 5, -6]} />
              </>
            )}
          </>
        )}

        {selectedObject === 'black_hole' && <BlackHole />}
        {selectedObject === 'quasar' && <Quasar />}
        {selectedObject === 'pulsar' && <Pulsar />}
        {selectedObject === 'galaxy' && <Galaxy />}

        {/* NEW: Lensing effect for black hole */}
        {selectedObject === 'black_hole' && <LensedBackground blackHolePosition={[0, 0, 0]} rs={1.5} />}

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={50}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </>
  );
}

export default Scene;