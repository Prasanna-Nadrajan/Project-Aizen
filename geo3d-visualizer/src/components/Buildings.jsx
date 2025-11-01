import * as THREE from 'three';

function Building({ feature }) {
  const { coordinates } = feature.geometry;
  const height = feature.properties.height || 10;

  // Convert GeoJSON polygon to THREE.Shape
  const shape = new THREE.Shape();
  coordinates[0].forEach(([x, y], i) => {
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  });

  return (
    <mesh position={[0, 0, 0]}>
      <extrudeGeometry args={[shape, { depth: height, bevelEnabled: false }]} />
      <meshStandardMaterial color="#2f20ffff" />
    </mesh>
  );
}

export default Building;