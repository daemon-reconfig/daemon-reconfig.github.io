// src/app/components/Player.tsx
'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import useKeyboard from './useKeyboardControls';

export function Player() {
  const controls = useRef<any>(null);
  const { camera, gl } = useThree();
  const keys = useKeyboard();
  const speed = 2; // units per second—feel free to tweak between 1–5

  // Lock pointer on first click
  useEffect(() => {
    const onClick = () => controls.current?.lock();
    gl.domElement.addEventListener('click', onClick);
    return () => gl.domElement.removeEventListener('click', onClick);
  }, [gl.domElement]);

  useFrame((_, delta) => {
    if (!controls.current?.isLocked) return;

    // Build forward & right vectors in the XZ plane
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up);

    // Compute move vector
    const move = new THREE.Vector3();
    if (keys.forward)  move.add(forward);
    if (keys.backward) move.sub(forward);
    if (keys.right)    move.add(right);
    if (keys.left)     move.sub(right);

    if (move.lengthSq() === 0) return;

    move.normalize().multiplyScalar(speed * delta);

    // Translate camera and the controls’ internal object
    camera.position.add(move);
    controls.current.getObject().position.copy(camera.position);
  });

  return <PointerLockControls ref={controls} />;
}
