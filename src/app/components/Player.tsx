// src/app/components/Player.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { useBox } from '@react-three/cannon';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

declare global {
  interface Window {
    keyStates?: Record<string, boolean>;
  }
}

export default function Player() {
  const { camera, gl } = useThree();

  // Use ElementRef to infer the instance type of PointerLockControls
  type PLCRef = React.ElementRef<typeof PointerLockControls>;
  const controls = useRef<PLCRef>(null);

  // create an invisible physics body
  const [ref, api] = useBox<THREE.Mesh>(() => ({
    mass: 1,
    position: [0, 1, 4], // spawn in front of desk
    args: [0.5, 1.7, 0.5],
    fixedRotation: true,
  }));

  // keyboard + pointer-lock setup
  useEffect(() => {
    if (!window.keyStates) window.keyStates = {};
    const down = (e: KeyboardEvent) => (window.keyStates![e.code] = true);
    const up = (e: KeyboardEvent) => (window.keyStates![e.code] = false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);

    const canvas = gl.domElement;
    canvas.style.cursor = 'none';
    const lock = () => controls.current?.lock();
    canvas.addEventListener('click', lock);

    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      canvas.removeEventListener('click', lock);
    };
  }, [gl.domElement]);

  // preserve and apply velocity each frame
  const vel = useRef<[number, number, number]>([0, 0, 0]);
  useEffect(() => {
    api.velocity.subscribe((v) => (vel.current = v as [number, number, number]));
  }, [api.velocity]);

  useFrame(() => {
    const speed = 4;
    const keys = window.keyStates || {};

    // camera‐relative axes
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    // compute desired velocity
    const move = new THREE.Vector3();
    if (keys['KeyW']) move.add(forward);
    if (keys['KeyS']) move.sub(forward);
    if (keys['KeyD']) move.add(right);
    if (keys['KeyA']) move.sub(right);
    move.normalize().multiplyScalar(speed);

    // apply to body (preserving Y)
    api.velocity.set(move.x, vel.current[1], move.z);

    // sync camera to the body
    const p = new THREE.Vector3();
    ref.current!.getWorldPosition(p);
    camera.position.copy(p).add(new THREE.Vector3(0, 0.9, 0));
  });

  return <PointerLockControls ref={controls} />;
}
