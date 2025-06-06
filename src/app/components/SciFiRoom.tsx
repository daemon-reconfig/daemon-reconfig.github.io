// src/app/components/SciFiRoom.tsx
'use client';

import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SciFiRoomProps {
  onMonitorClick: () => void;
}

export default function SciFiRoom({ onMonitorClick }: SciFiRoomProps) {
  const { scene } = useGLTF('/models/scene.glb');
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    // (Optional room animations, if you had any)
  });

  return (
    <group
      ref={group}
      onPointerDown={(e) => {
        e.stopPropagation();
        // Trigger only when clicking exactly on Object_13 (your monitor)
        if (e.object.name === 'Object_13') {
          onMonitorClick();
        }
      }}
    >
      <primitive object={scene} />
    </group>
  );
}
