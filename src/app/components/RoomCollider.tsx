// src/app/components/RoomCollider.tsx
'use client';

import { useBox } from '@react-three/cannon';

export function Colliders() {
  // Floor
  useBox(() => ({
    args: [10, 0.1, 10],
    position: [0, -0.05, 0],
    type: 'Static',
  }));
  // Left wall
  useBox(() => ({
    args: [0.1, 2, 10],
    position: [-5, 1, 0],
    type: 'Static',
  }));
  // Right wall
  useBox(() => ({
    args: [0.1, 2, 10],
    position: [5, 1, 0],
    type: 'Static',
  }));
  // Back wall
  useBox(() => ({
    args: [10, 2, 0.1],
    position: [0, 1, -5],
    type: 'Static',
  }));
  // Front wall
  useBox(() => ({
    args: [10, 2, 0.1],
    position: [0, 1, 5],
    type: 'Static',
  }));
  // Desk
  useBox(() => ({
    args: [1, 1, 2],
    position: [0, 0.5, 3],
    type: 'Static',
  }));
  return null;
}
