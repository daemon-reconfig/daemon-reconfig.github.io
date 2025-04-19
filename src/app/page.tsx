'use client';

import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('./components/SceneWrapper'), { ssr: false });

export default function Home() {
  return <Scene />;
}
