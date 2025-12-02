import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei'; // Fixed: Removed 'Fog' import
import House from './House';
import Ground from './Ground';
// import from './Tree'; // Note: Check this import path, assuming 'Tree' is correct based on context
import Tree from './Tree';
import Fence from './Fence';
import Cloud from './Cloud';
import Sun from './Sun';
import Mountain from './Mountain';
import BlackHole from './astronomy/BlackHole';
import Quasar from './astronomy/Quasar';
import Pulsar from './astronomy/Pulsar';
import Galaxy from './astronomy/Galaxy';

function Scene() {
    const [timeOfDay, setTimeOfDay] = useState('day');
    const [selectedObject, setSelectedObject] = useState('house');

    const sceneSettings = {
        day: {
            bgColor: '#87ceeb',
            ambientIntensity: 0.6,
            sunIntensity: 1.5,
            showStars: false,
            fogColor: '#87ceeb',
            fogDensity: 0.008
        },
        sunset: {
            bgColor: '#ff6b35',
            ambientIntensity: 0.4,
            sunIntensity: 1.2,
            showStars: false,
            fogColor: '#ff9e6d',
            fogDensity: 0.01
        },
        night: {
            bgColor: '#0a1128',
            ambientIntensity: 0.1,
            sunIntensity: 0.1,
            showStars: true,
            fogColor: '#050a19',
            fogDensity: 0.015
        },
        space: {
            bgColor: '#000000',
            ambientIntensity: 0.1,
            sunIntensity: 0,
            showStars: true,
            fogColor: '#000000',
            fogDensity: 0
        }
    };

    const isSpaceObject = selectedObject !== 'house';
    const currentSettings = isSpaceObject ? sceneSettings.space : sceneSettings[timeOfDay];

    // Procedurally generate forests and mountains
    const { forest, mountains } = useMemo(() => {
        const forestItems = [];
        const mountainItems = [];

        // Forest: Random trees in a donut shape (avoiding the center neighborhood)
        for (let i = 0; i < 80; i++) {
            const angle = Math.random() * Math.PI * 2;
            const minRadius = 25;
            const maxRadius = 90;
            const radius = minRadius + Math.random() * (maxRadius - minRadius);
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            // Random scale for variety
            const scale = 0.8 + Math.random() * 0.6;

            forestItems.push({
                position: [x, 0, z],
                scale: [scale, scale, scale]
            });
        }

        // Mountains: Ring of mountains far out
        for (let i = 0; i < 25; i++) {
            const angle = (i / 25) * Math.PI * 2 + (Math.random() * 0.2);
            const radius = 100 + Math.random() * 20;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const scale = 4 + Math.random() * 4; // Large mountains

            mountainItems.push({
                position: [x, 0, z],
                scale: [scale, scale * (0.8 + Math.random() * 0.5), scale],
                rotation: [0, Math.random() * Math.PI, 0]
            });
        }

        return { forest: forestItems, mountains: mountainItems };
    }, []);

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
                <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#333', fontWeight: 600 }}>
                    Scene Controls
                </h3>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#555', fontWeight: 500 }}>
                        Select Object
                    </label>
                    <select
                        value={selectedObject}
                        onChange={(e) => setSelectedObject(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '2px solid #e0e0e0', fontSize: '14px', cursor: 'pointer', background: 'white', marginBottom: '10px' }}
                    >
                        <option value="house">🏡 Nature Scene</option>
                        <option value="black_hole">⚫ Black Hole</option>
                        <option value="quasar">✨ Quasar</option>
                        <option value="pulsar">💫 Pulsar</option>
                        <option value="galaxy">🌌 Galaxy</option>
                    </select>
                </div>

                {!isSpaceObject && (
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#555', fontWeight: 500 }}>
                            Time of Day
                        </label>
                        <select
                            value={timeOfDay}
                            onChange={(e) => setTimeOfDay(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '2px solid #e0e0e0', fontSize: '14px', cursor: 'pointer', background: 'white' }}
                        >
                            <option value="day">☀️ Day</option>
                            <option value="sunset">🌅 Sunset</option>
                            <option value="night">🌙 Night</option>
                        </select>
                    </div>
                )}

                <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '2px solid #e0e0e0', fontSize: '12px', color: '#666', lineHeight: '1.6' }}>
                    <p style={{ margin: '0 0 6px 0' }}><strong>Controls:</strong></p>
                    <p style={{ margin: '0 0 4px 0' }}>• Drag to rotate view</p>
                    <p style={{ margin: '0 0 4px 0' }}>• Scroll to zoom</p>
                    <p style={{ margin: '0' }}>• Hover over objects</p>
                </div>
            </div>

            {/* Title */}
            <div style={{ position: 'absolute', bottom: '30px', left: '30px', color: 'white', fontFamily: 'system-ui, sans-serif', zIndex: 10, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                <h1 style={{ margin: 0, fontSize: '36px', fontWeight: 700 }}>
                    {isSpaceObject ? 'Cosmic Viewer' : 'Alpine Village'}
                </h1>
                <p style={{ margin: '5px 0 0 0', fontSize: '16px', opacity: 0.9 }}>
                    {isSpaceObject ? 'Exploring the Universe' : 'A peaceful neighborhood in the valley'}
                </p>
            </div>

            {/* Canvas */}
            <Canvas
                shadows
                camera={{ position: [20, 15, 30], fov: 50 }}
                gl={{ antialias: true }}
            >
                <color attach="background" args={[currentSettings.bgColor]} />

                {/* Fog for depth perception (only in terrestrial scenes) */}
                {!isSpaceObject && <fog attach="fog" args={[currentSettings.fogColor, 10, 150]} />}

                {(currentSettings.showStars || isSpaceObject) && <Stars radius={100} depth={50} count={isSpaceObject ? 10000 : 5000} factor={4} saturation={0} fade speed={1} />}

                <ambientLight intensity={currentSettings.ambientIntensity} />

                {!isSpaceObject && (
                    <>
                        <Sun />
                        <directionalLight
                            position={[50, 50, 20]}
                            intensity={currentSettings.sunIntensity}
                            castShadow
                            shadow-mapSize-width={2048}
                            shadow-mapSize-height={2048}
                            shadow-camera-left={-50}
                            shadow-camera-right={50}
                            shadow-camera-top={50}
                            shadow-camera-bottom={-50}
                        />

                        <Ground />

                        {/* --- The Neighborhood --- */}
                        <House position={[0, 0, 0]} wallColor="#f2e9e4" roofColor="#4a4e69" />
                        <House position={[-10, 0, 3]} rotation={[0, 0.4, 0]} wallColor="#dbe7e4" roofColor="#22223b" />
                        <House position={[10, 0, -2]} rotation={[0, -0.3, 0]} wallColor="#ffedd8" roofColor="#9a8c98" />
                        <House position={[0, 0, -15]} rotation={[0, Math.PI, 0]} wallColor="#e2e2e2" roofColor="#5e503f" />

                        {/* Neighborhood Trees */}
                        <Tree position={[-6, 0, 8]} />
                        <Tree position={[6, 0, 7]} />
                        <Tree position={[-12, 0, -5]} />
                        <Tree position={[14, 0, 5]} />

                        {/* The Forest */}
                        {forest.map((tree, i) => (
                            <group key={`forest-${i}`} scale={tree.scale}>
                                <Tree position={tree.position} />
                            </group>
                        ))}

                        {/* The Mountains */}
                        {mountains.map((mount, i) => (
                            <Mountain
                                key={`mountain-${i}`}
                                position={mount.position}
                                scale={mount.scale}
                                rotation={mount.rotation}
                            />
                        ))}

                        {/* Fences */}
                        <Fence position={[0, 0, 8]} rotation={[0, 0, 0]} />
                        <Fence position={[-6, 0, 8]} rotation={[0, 0, 0]} />
                        <Fence position={[6, 0, 8]} rotation={[0, 0, 0]} />
                        <Fence position={[-15, 0, 3]} rotation={[0, Math.PI / 2, 0]} />
                        <Fence position={[15, 0, 3]} rotation={[0, Math.PI / 2, 0]} />

                        {timeOfDay !== 'night' && (
                            <>
                                <Cloud position={[4, 15, -6]} />
                                <Cloud position={[-15, 18, -20]} />
                                <Cloud position={[20, 16, -10]} />
                                <Cloud position={[0, 22, -30]} />
                                <Cloud position={[-25, 14, 10]} />
                            </>
                        )}
                    </>
                )}

                {/* Space Objects */}
                {selectedObject === 'black_hole' && <BlackHole />}
                {selectedObject === 'quasar' && <Quasar />}
                {selectedObject === 'pulsar' && <Pulsar />}
                {selectedObject === 'galaxy' && <Galaxy />}

                <OrbitControls
                    enableDamping
                    dampingFactor={0.05}
                    minDistance={5}
                    maxDistance={120} // Increased max distance to see mountains
                    maxPolarAngle={Math.PI / 2.05}
                />
            </Canvas>
        </>
    );
}

export default Scene;