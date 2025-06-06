// src/app/components/InteractionHandler.tsx
'use client';

import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function InteractionHandler() {
  const { camera, scene } = useThree();

  // Memoize raycaster and pointer so they don't get recreated on every render
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointer = useMemo(() => new THREE.Vector2(), []);

  useEffect(() => {
    function onMove(event: MouseEvent) {
      // Update normalized device coordinates
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Cast a ray from the camera
      raycaster.setFromCamera(pointer, camera);

      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        // Handle hover/selection logic here…
        // For example: console.log(intersects[0].object.name);
      }
    }

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
    };
  }, [camera, scene, pointer, raycaster]); // now raycaster/pointer are stable

  return null;
}
