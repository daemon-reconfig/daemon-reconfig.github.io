'use client';

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Html, useProgress } from '@react-three/drei';
import SciFiRoom from './SciFiRoom';
import { Colliders } from './RoomCollider';
import Player from './Player';
import AccessPrompt from './AccessPrompt';
import HUDOverlay from './HUDOverlay';

function SceneLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div
        style={{
          color: '#7ef8ff',
          background: 'rgba(0,0,0,0.75)',
          border: '1px solid #7ef8ff',
          padding: '10px 14px',
          fontFamily: 'monospace',
        }}
      >
        Loading Sector {Math.round(progress)}%
      </div>
    </Html>
  );
}

export default function SceneWrapper() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showHUD, setShowHUD] = useState(true);

  const handleMonitorClick = () => {
    setShowPrompt(true);
    setShowHUD(false);
  };

  const handlePromptClose = () => {
    setShowPrompt(false);
    setShowHUD(true);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: showPrompt ? 'none' : 'auto',
        }}
      >
        <Canvas
          camera={{ position: [0, 0.6, 0.8], fov: 70 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, powerPreference: 'high-performance' }}
          shadows
        >
          <ambientLight intensity={0.45} />
          <directionalLight
            castShadow
            intensity={0.7}
            color={0xffffff}
            position={[5, 10, 5]}
            shadow-mapSize-width={512}
            shadow-mapSize-height={512}
          />

          <Suspense fallback={<SceneLoader />}>
            <SciFiRoom onMonitorClick={handleMonitorClick} />
            <Physics gravity={[0, -9.81, 0]}>
              <Colliders />
              <Player />
            </Physics>
          </Suspense>
        </Canvas>
      </div>

      {showHUD && <HUDOverlay />}
      {showPrompt && <AccessPrompt correctPassword="breefcase2" onClose={handlePromptClose} />}
    </div>
  );
}
