// src/app/computer/page.tsx
'use client';
import React from 'react';
import LinuxDesktop from '../components/LinuxDesktop';

export default function ComputerPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <LinuxDesktop />
    </div>
  );
}
