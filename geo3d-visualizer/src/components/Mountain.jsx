import React from 'react';

function Mountain({ position, scale = [1, 1, 1], rotation = [0, 0, 0], color = "#6c757d" }) {
    return (
        <group position={position} rotation={rotation} scale={scale}>
            {/* Mountain Base */}
            <mesh castShadow receiveShadow position={[0, 2.5, 0]}>
                <coneGeometry args={[4, 5, 5]} />
                <meshStandardMaterial color={color} flatShading roughness={0.9} />
            </mesh>

            {/* Snow Cap */}
            <mesh position={[0, 4, 0]}>
                <coneGeometry args={[1.8, 2, 5]} />
                <meshStandardMaterial color="#ffffff" flatShading roughness={0.3} />
            </mesh>
        </group>
    );
}

export default Mountain;