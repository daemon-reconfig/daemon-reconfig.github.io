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
  const [showStickyNoteZoom, setShowStickyNoteZoom] = useState(false);

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

      {!showPrompt && (
        <button
          onClick={() => setShowStickyNoteZoom(true)}
          style={{
            position: 'absolute',
            right: 16,
            bottom: 18,
            zIndex: 1000,
            border: '1px solid #79f7ff',
            background: 'rgba(6, 8, 18, 0.88)',
            color: '#bcfbff',
            padding: '8px 12px',
            fontFamily: 'monospace',
            letterSpacing: '0.04em',
            cursor: 'pointer',
          }}
        >
          🔍 Sticky Note Zoom
        </button>
      )}

      {showStickyNoteZoom && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1001,
            display: 'grid',
            placeItems: 'center',
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setShowStickyNoteZoom(false)}
        >
          <div
            style={{
              width: 'min(84vw, 560px)',
              transform: 'rotate(-2deg) scale(1.2)',
              background: 'linear-gradient(180deg, #ffeb68, #ffd53d)',
              color: '#2c2400',
              border: '2px solid rgba(80, 70, 0, 0.45)',
              boxShadow: '0 16px 45px rgba(0,0,0,.55)',
              padding: '24px',
              borderRadius: 6,
              fontFamily: 'monospace',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 10 }}>Desk Sticky // Zoomed</div>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '0.08em' }}>password:</div>
            <div style={{ fontSize: 40, fontWeight: 700, marginTop: 6, marginBottom: 18 }}>breefcase2</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>Tip: Click outside this note to return to the room.</div>
          </div>
        </div>
      )}
    </div>
  );
}
