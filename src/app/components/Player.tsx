'use client'

import React, { useEffect, useRef } from 'react'
import { useSphere } from '@react-three/cannon'
import { useThree, useFrame } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'

declare global {
  interface Window {
    keyStates?: Record<string, boolean>
  }
}

export default function Player() {
  const { camera, gl } = useThree()
  const controls = useRef<any>(null)

  // ─── 1) Create a physics sphere for the player ───
  //    We deliberately use useSphere here (radius = 0.5) so that
  //    cannon.js won’t get “stuck” in sharp edges of a box.
  //    Initial position is high (y = 5) to avoid it spawning inside geometry.
  const [ref, api] = useSphere(() => ({
    mass: 1,
    args: [0.5],           // sphere radius
    fixedRotation: true,   // no tumbling
    position: [0, 1.3, 5],   // start above the ground
  }))

  // ─── 2) Keyboard + PointerLock setup ───
  useEffect(() => {
    if (!window.keyStates) window.keyStates = {}
    const handleKeyDown = (e: KeyboardEvent) => (window.keyStates![e.code] = true)
    const handleKeyUp   = (e: KeyboardEvent) => (window.keyStates![e.code] = false)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    const canvas = gl.domElement
    canvas.style.cursor = 'none'
    const lockPointer = () => {
      if (controls.current) controls.current.lock()
    }
    if (!canvas.dataset.lockBound) {
      canvas.dataset.lockBound = 'true'
      canvas.addEventListener('click', lockPointer)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      canvas.removeEventListener('click', lockPointer)
    }
  }, [gl.domElement])

  // ─── 3) Subscribe to cannon.js velocity so we can preserve vertical (Y) speed ───
  const vel = useRef<[number, number, number]>([0, 0, 0])
  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((v) => {
      vel.current = v as [number, number, number]
    })
    return () => unsubscribe()
  }, [api.velocity])

  // ─── 4) Each frame: read keys, set new velocity, and sync camera to the sphere ───
  useFrame(() => {
    // If the physics body isn’t ready yet, skip.
    if (!ref.current) return

    const speed = 4
    const keys = window.keyStates || {}

    // compute camera-relative forward/right
    const forward = new THREE.Vector3()
    camera.getWorldDirection(forward)
    forward.y = 0
    forward.normalize()

    const right = new THREE.Vector3()
      .crossVectors(forward, new THREE.Vector3(0, 1, 0))
      .normalize()

    // decide movement vector
    const move = new THREE.Vector3()
    if (keys['KeyW']) move.add(forward)
    if (keys['KeyS']) move.sub(forward)
    if (keys['KeyD']) move.add(right)
    if (keys['KeyA']) move.sub(right)
    move.normalize().multiplyScalar(speed)

    // safely set physics velocity (preserving Y component)
    if (api.velocity.set) {
      api.velocity.set(move.x, vel.current[1], move.z)
    }

    // sync camera position to the center of the sphere + offset in Y
    const pos = new THREE.Vector3()
    ref.current.getWorldPosition(pos)
    camera.position.copy(pos).add(new THREE.Vector3(0, 0.9, 0))
  })

  // ─── 5) Render: an (invisible) sphere‐mesh plus the PointerLockControls ───
  return (
    <>
      <mesh ref={ref}>
        <sphereGeometry args={[0.5, 32, 32]} />
        {/* Keep the material invisible (opacity: 0) so you don’t see a visible ball. */}
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <PointerLockControls ref={controls} />
    </>
  )
}
