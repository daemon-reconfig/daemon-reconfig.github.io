// src/app/components/InteractionHandler.tsx
'use client';

import { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Raycaster, Vector2, Mesh } from 'three';
import AccessPrompt from './AccessPrompt';

export default function InteractionHandler() {
  const { camera, gl, scene } = useThree();
  const [open, setOpen] = useState(false);
  const raycaster = new Raycaster();
  const pointer = new Vector2();
  const PASSWORD = 'YOUR_PASSWORD'; // match your sticky note

  // On click, raycast and check for screen
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // if prompt already open, ignore scene clicks
      if (open) return;

      // Calculate pointer in normalized device coords
      const rect = gl.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(scene.children, true);

      for (const hit of hits) {
        // Replace with your actual mesh name or tag
        if (hit.object.name === 'ComputerScreen') {
          setOpen(true);
          break;
        }
      }
    };

    gl.domElement.addEventListener('click', handleClick);
    return () => gl.domElement.removeEventListener('click', handleClick);
  }, [camera, gl.domElement, scene, open]);

  // Render the ACCESS prompt overlay when open
  return open ? (
    <AccessPrompt
      correctPassword={PASSWORD}
      onClose={() => setOpen(false)}
    />
  ) : null;
}
