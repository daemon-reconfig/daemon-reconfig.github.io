'use client'

import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { usePlane } from '@react-three/cannon'
import * as THREE from 'three'

export function Colliders() {
  // 1) Load the same GLTF so we can find floor height (min.y)
  const gltf = useGLTF('/models/scene.glb')

  // 2) Compute the bounding box once to get min.y and center.x/z
  const { min, center } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(gltf.scene)
    return {
      min: box.min.clone(),                          // { x, y (floor), z }
      center: box.getCenter(new THREE.Vector3()).clone(), // { x, y, z }
    }
  }, [gltf.scene])

  // 3) Create exactly one floor plane at y = min.y
  usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [center.x, min.y, center.z],
  }))

  return null
}
