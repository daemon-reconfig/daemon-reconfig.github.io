'use client';

import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';

export default function SciFiRoom() {
  const { scene } = useGLTF('/models/scene.gltf');
  useEffect(() => {
    console.log('--- scene graph ---');
    scene.traverse((obj) => {
      console.log(obj.type, obj.name);
    });
  }, [scene]);
  return <primitive object={scene} scale={1.5} />;
}
