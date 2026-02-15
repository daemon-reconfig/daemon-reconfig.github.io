'use client';

import React, { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SciFiRoomProps {
  onMonitorClick: () => void;
}

export default function SciFiRoom({ onMonitorClick }: SciFiRoomProps) {
  const { scene } = useGLTF('/models/scene.glb');
  const group = useRef<THREE.Group>(null);

  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame(() => {
    // room animation hook kept for future use
  });

  return (
    <group
      ref={group}
      onPointerDown={(e) => {
        e.stopPropagation();
        if (e.object.name === 'Object_13') {
          onMonitorClick();
        }
      }}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload('/models/scene.glb');
