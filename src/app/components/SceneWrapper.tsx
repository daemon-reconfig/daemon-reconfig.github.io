// src/app/SceneWrapper.tsx
'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import SciFiRoom from './SciFiRoom';
import { Colliders } from './RoomCollider';
import Player from './Player';
import LinuxDesktop from './LinuxDesktop';
import AccessPrompt from './AccessPrompt';
import HUDOverlay from './HUDOverlay';

export default function SceneWrapper() {
  // ─── Overlay state flags ───
  const [showPrompt, setShowPrompt] = useState(false);
  const [showDesktop, setShowDesktop] = useState(false);
  const [showHUD, setShowHUD] = useState(true);

  // ─── Dev HMR key hack (force new Canvas on hot reload) ───
  const [key, setKey] = useState(0);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setKey((k) => k + 1);
    }
  }, []);

  // ─── Handlers ───
  const handleMonitorClick = () => {
    setShowPrompt(true);
    setShowHUD(false);
  };

  const handlePromptClose = () => {
    setShowPrompt(false);
    setShowHUD(true);
  };

  const handlePromptSuccess = () => {
    setShowPrompt(false);
    setShowDesktop(true);
  };

  const handleExitDesktop = () => {
    setShowDesktop(false);
    setShowHUD(true);
  };

  // ─── Disable canvas pointer events when any overlay is visible ───
  const disableCanvasPointer = showPrompt || showDesktop;

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* ─── Canvas wrapper (toggles pointerEvents) ─── */}
      <div
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: disableCanvasPointer ? 'none' : 'auto',
        }}
      >
        <Canvas key={key} camera={{ position: [0, 2, 10] }} shadows>
          {/* Ambient & Directional Lights */}
          <ambientLight intensity={0.5} />
          <directionalLight
            castShadow
            intensity={0.8}
            color={0xffffff}
            position={[5, 10, 5]}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={1}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />

          {/* 3D scene */}
          <Suspense fallback={null}>
            <SciFiRoom onMonitorClick={handleMonitorClick} />
            <Physics gravity={[0, -9.81, 0]}>
              <Colliders />
              <Player />
            </Physics>
          </Suspense>
        </Canvas>
      </div>

      {/* ─── HUD Overlay (HTML/CSS, outside Canvas) ─── */}
      {showHUD && <HUDOverlay />}

      {/* ─── Access Prompt Overlay ─── */}
      {showPrompt && (
        <AccessPrompt
          correctPassword="letmein"
          onClose={handlePromptClose}
          onSuccess={handlePromptSuccess}
        />
      )}

      {/* ─── Linux Desktop Overlay ─── */}
      {showDesktop && <LinuxDesktop onExit={handleExitDesktop} />}
    </div>
  );
}
