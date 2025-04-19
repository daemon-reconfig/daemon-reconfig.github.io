'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import SciFiRoom from './SciFiRoom';
import { Player } from './Player';
import InteractionHandler from './InteractionHandler';

export default function SceneWrapper() {
  return (
    <div className="h-screen w-screen">
      <Canvas shadows camera={{ fov: 75, position: [0, 0, 4] }}>
        {/* Base ambient light */}
        <ambientLight intensity={0.5} />

        {/* 3D scene */}
        <Suspense fallback={null}>
          <SciFiRoom />
        </Suspense>

        {/* Your custom FPS controller with WASD + pointer lock */}
        <Player />
        <InteractionHandler />
      </Canvas>
    </div>
  );
}
