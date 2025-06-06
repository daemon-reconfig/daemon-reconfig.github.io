// src/app/components/FPSController.tsx
'use client';

import React, { useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

declare global {
  interface Window {
    keyStates?: Record<string, boolean>;
  }
}

interface Props {
  bounds: THREE.Box3[];
}

export default function FPSController({ bounds }: Props) {
  const { camera } = useThree();

  // Track key presses
  useEffect(() => {
    if (!window.keyStates) window.keyStates = {};
    const down = (e: KeyboardEvent) => (window.keyStates![e.code] = true);
    const up   = (e: KeyboardEvent) => (window.keyStates![e.code] = false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  // Movement & collision each frame
  useFrame((_, dt) => {
    const speed = 5;
    const keys = window.keyStates || {};

    // Build camera‑relative forward/right
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    // Desired movement
    const move = new THREE.Vector3();
    if (keys['KeyW']) move.add(forward);
    if (keys['KeyS']) move.sub(forward);
    if (keys['KeyD']) move.add(right);
    if (keys['KeyA']) move.sub(right);
    if (move.lengthSq() > 0) move.normalize().multiplyScalar(speed * dt);

    // Attempt X and Z separately
    const newPos = camera.position.clone();

    // X axis
    newPos.x += move.x;
    if (!bounds.some((b) => newPos.x > b.min.x && newPos.x < b.max.x && newPos.z > b.min.z && newPos.z < b.max.z)) {
      camera.position.x = newPos.x;
    }

    // Z axis
    newPos.z = camera.position.z + move.z;
    if (!bounds.some((b) => newPos.x > b.min.x && newPos.x < b.max.x && newPos.z > b.min.z && newPos.z < b.max.z)) {
      camera.position.z = newPos.z;
    }
  });

  return (
    <>
      {/* OrbitControls lets you click‑drag to look around */}
      <OrbitControls enablePan={false} enableDamping dampingFactor={0.1} />
    </>
  );
}
