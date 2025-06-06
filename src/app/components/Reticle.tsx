// src/app/components/Reticle.tsx
'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ReticleProps {
  distance?: number;       // how far in front of the cam
  outerRadius?: number;    // radius of outer arc ring
  innerRadius?: number;    // radius of inner arc ring
  outerArcLen?: number;    // rad‑length of each outer segment
  innerArcLen?: number;    // rad‑length of each inner segment
  thickness?: number;      // tube thickness
  outerSpeed?: number;     // rad/sec CCW
  innerSpeed?: number;     // rad/sec CW (negative)
  color?: string;
}

export function Reticle({
  distance     = 2,
  outerRadius  = 0.12,
  innerRadius  = 0.07,
  outerArcLen  = Math.PI / 3,  // 60°
  innerArcLen  = Math.PI / 4,  // 45°
  thickness    = 0.004,
  outerSpeed   = 0.6,
  innerSpeed   = -1.0,
  color        = '#0ff',
}: ReticleProps) {
  const group      = useRef<THREE.Group>(null!);
  const outerGp    = useRef<THREE.Group>(null!);
  const innerGp    = useRef<THREE.Group>(null!);
  const { camera } = useThree();

  // Precompute the 4 angles where we'll place each segment
  const outerAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
  const innerAngles = outerAngles.map(a => a + Math.PI / 4); // offset by 45°

  useFrame((_, delta) => {
    // 1) Stick the whole group in front of the camera
    const pos = new THREE.Vector3(0, 0, -distance).applyMatrix4(camera.matrixWorld);
    group.current.position.copy(pos);
    group.current.quaternion.copy(camera.quaternion);

    // 2) Rotate each sub‑group
    outerGp.current.rotation.z += outerSpeed * delta;
    innerGp.current.rotation.z += innerSpeed * delta;
  });

  return (
    <group ref={group}>
      {/* Outer segmented ring */}
      <group ref={outerGp}>
        {outerAngles.map((angle, i) => (
          <mesh key={`o${i}`} rotation={[0, 0, angle]} renderOrder={999}>
            <torusGeometry args={[outerRadius, thickness, 16, 128, outerArcLen]} />
            <meshBasicMaterial color={color} toneMapped={false} depthTest={false} />
          </mesh>
        ))}
      </group>

      {/* Inner segmented ring */}
      <group ref={innerGp}>
        {innerAngles.map((angle, i) => (
          <mesh key={`i${i}`} rotation={[0, 0, angle]} renderOrder={999}>
            <torusGeometry args={[innerRadius, thickness, 16, 128, innerArcLen]} />
            <meshBasicMaterial color={color} toneMapped={false} depthTest={false} />
          </mesh>
        ))}
      </group>

      {/* Four arrowhead indicators */}
      {outerAngles.map((angle, i) => {
        // position arrow just outside the outer arc
        const x = Math.cos(angle) * (outerRadius + 0.02);
        const y = Math.sin(angle) * (outerRadius + 0.02);
        return (
          <mesh
            key={`arrow${i}`}
            position={[x, y, 0]}
            rotation={[0, 0, angle + Math.PI / 2]}
            renderOrder={999}
          >
            <coneGeometry args={[0.008, 0.02, 6]} />
            <meshBasicMaterial color={color} toneMapped={false} depthTest={false} />
          </mesh>
        );
      })}
    </group>
  );
}
