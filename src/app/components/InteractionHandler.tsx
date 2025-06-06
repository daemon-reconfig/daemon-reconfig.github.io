// src/app/components/InteractionHandler.tsx
'use client';

import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function InteractionHandler() {
  const { camera, scene } = useThree();
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  useEffect(() => {
    function onMove(event: MouseEvent) {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        // handle interaction…
      }
    }

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
    };
  }, [camera, scene, pointer, raycaster]); // included pointer & raycaster

  return null;
}
