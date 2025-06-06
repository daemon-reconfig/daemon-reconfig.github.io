// src/app/RoomCollider.tsx
'use client';

import { useMemo } from 'react';
import { useBox, usePlane } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

type ColliderDef = {
  args: [number, number, number];
  position: [number, number, number];
};

/**
 * Colliders sets up:
 *  • Four thin interior wall colliders around Object_12
 *  • One monitor collider around Object_13
 *  • One keyboard collider around Object_17
 *  • A flat floor plane at y = 0
 *
 * All useBox calls are unconditionally invoked in fixed order,
 * using dummy colliders when any mesh is missing.
 */
export function Colliders() {
  const gltf = useGLTF('/models/scene.glb');

  const WALL_MESH = 'Object_12';
  const MONITOR_MESH = 'Object_13';
  const KEYBOARD_MESH = 'Object_17';

  // 1) Compute four thin wall colliders
  const wallDefs: ColliderDef[] = useMemo(() => {
    const mesh = gltf.scene.getObjectByName(WALL_MESH) as THREE.Mesh | undefined;
    if (!mesh) {
      console.warn(`[Colliders] Wall mesh "${WALL_MESH}" not found`);
      return [];
    }

    mesh.updateWorldMatrix(true, false);
    mesh.geometry.computeBoundingBox();
    const box3 = new THREE.Box3().setFromObject(mesh);
    const min = box3.min;
    const max = box3.max;
    const size = new THREE.Vector3();
    box3.getSize(size);

    const thickness = 0.2;
    const centerY = (min.y + max.y) / 2;
    const height = size.y;

    const leftPos: [number, number, number] = [
      min.x + thickness / 2,
      centerY,
      (min.z + max.z) / 2,
    ];
    const leftArgs: [number, number, number] = [
      thickness,
      height,
      size.z - thickness * 2,
    ];

    const rightPos: [number, number, number] = [
      max.x - thickness / 2,
      centerY,
      (min.z + max.z) / 2,
    ];
    const rightArgs: [number, number, number] = [
      thickness,
      height,
      size.z - thickness * 2,
    ];

    const backPos: [number, number, number] = [
      (min.x + max.x) / 2,
      centerY,
      min.z + thickness / 2,
    ];
    const backArgs: [number, number, number] = [
      size.x - thickness * 2,
      height,
      thickness,
    ];

    const frontPos: [number, number, number] = [
      (min.x + max.x) / 2,
      centerY,
      max.z - thickness / 2,
    ];
    const frontArgs: [number, number, number] = [
      size.x - thickness * 2,
      height,
      thickness,
    ];

    return [
      { args: leftArgs, position: leftPos },
      { args: rightArgs, position: rightPos },
      { args: backArgs, position: backPos },
      { args: frontArgs, position: frontPos },
    ];
  }, [gltf.scene]);

  // 2) Compute monitor collider
  const monitorDef: ColliderDef = useMemo(() => {
    const mesh = gltf.scene.getObjectByName(MONITOR_MESH) as THREE.Mesh | undefined;
    if (!mesh) {
      console.warn(`[Colliders] Monitor mesh "${MONITOR_MESH}" not found`);
      return { args: [0.1, 0.1, 0.1], position: [0, -100, 0] };
    }
    mesh.updateWorldMatrix(true, false);
    mesh.geometry.computeBoundingBox();
    const box3 = new THREE.Box3().setFromObject(mesh);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box3.getSize(size);
    box3.getCenter(center);
    return { args: [size.x, size.y, size.z], position: [center.x, center.y, center.z] };
  }, [gltf.scene]);

  // 3) Compute keyboard collider
  const keyboardDef: ColliderDef = useMemo(() => {
    const mesh = gltf.scene.getObjectByName(KEYBOARD_MESH) as THREE.Mesh | undefined;
    if (!mesh) {
      console.warn(`[Colliders] Keyboard mesh "${KEYBOARD_MESH}" not found`);
      return { args: [0.1, 0.1, 0.1], position: [0, -100, 0] };
    }
    mesh.updateWorldMatrix(true, false);
    mesh.geometry.computeBoundingBox();
    const box3 = new THREE.Box3().setFromObject(mesh);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box3.getSize(size);
    box3.getCenter(center);
    return { args: [size.x, size.y, size.z], position: [center.x, center.y, center.z] };
  }, [gltf.scene]);

  // 4) Prepare dummy fallback if fewer than 4 walls
  const dummyWall: ColliderDef = { args: [0.1, 0.1, 0.1], position: [0, -100, 0] };
  const w0 = wallDefs[0] || dummyWall;
  const w1 = wallDefs[1] || dummyWall;
  const w2 = wallDefs[2] || dummyWall;
  const w3 = wallDefs[3] || dummyWall;

  // 5) Register wall colliders (always four useBox calls)
  useBox<THREE.Mesh>(() => ({ args: w0.args, position: w0.position, type: 'Static' }));
  useBox<THREE.Mesh>(() => ({ args: w1.args, position: w1.position, type: 'Static' }));
  useBox<THREE.Mesh>(() => ({ args: w2.args, position: w2.position, type: 'Static' }));
  useBox<THREE.Mesh>(() => ({ args: w3.args, position: w3.position, type: 'Static' }));

  // 6) Register monitor collider (always one useBox call)
  useBox<THREE.Mesh>(() => ({
    args: monitorDef.args,
    position: monitorDef.position,
    type: 'Static',
  }));

  // 7) Register keyboard collider (always one useBox call)
  useBox<THREE.Mesh>(() => ({
    args: keyboardDef.args,
    position: keyboardDef.position,
    type: 'Static',
  }));

  // 8) Floor plane at y = 0 (one usePlane call)
  usePlane(() => ({
    position: [0, 0, 0],
    rotation: [-Math.PI / 2, 0, 0],
    type: 'Static',
  }));

  return null;
}
