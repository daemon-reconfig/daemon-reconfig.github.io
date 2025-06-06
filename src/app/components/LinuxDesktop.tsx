// src/app/components/LinuxDesktop.tsx
'use client';

import React from 'react';

export default function LinuxDesktop({ onExit }: { onExit: () => void }) {
  return (
    <div
      // ─── Top‐level overlay container ───
      style={{
        position: 'fixed',
        inset: 0,
        background: '#2d2d2d',
        color: '#cfcfcf',
        fontFamily: 'monospace',
        zIndex: 100,          // sits above the Canvas
        pointerEvents: 'auto', // intercept pointer events here
        display: 'flex',
        flexDirection: 'column',
      }}
      // ─── Prevent any click from falling through to the Canvas ───
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* ─── Top Bar ─── */}
      <div
        style={{
          height: '30px',
          background: '#444',
          display: 'flex',
          alignItems: 'center',
          padding: '0 10px',
          cursor: 'default',
        }}
      >
        <div style={{ flex: 1 }}>Old Linux Desktop</div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExit();
          }}
          style={{
            background: '#888',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: '2px 8px',
            fontSize: '12px',
          }}
        >
          Exit
        </button>
      </div>

      {/* ─── Main Content ─── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          padding: '20px',
          gap: '20px',
          cursor: 'default',
        }}
      >
        {/* ─── Sidebar Icons ─── */}
        <div
          style={{
            width: '100px',
            background: '#333',
            display: 'flex',
            flexDirection: 'column',
            padding: '10px',
            gap: '10px',
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              console.log('Icon 1 clicked');
            }}
            style={{ color: '#0f0', cursor: 'pointer' }}
          >
            🖳
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              console.log('Icon 2 clicked');
            }}
            style={{ color: '#0f0', cursor: 'pointer' }}
          >
            📂
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              console.log('Icon 3 clicked');
            }}
            style={{ color: '#0f0', cursor: 'pointer' }}
          >
            ⚙️
          </div>
        </div>

        {/* ─── Terminal Window ─── */}
        <div
          style={{
            flex: 1,
            background: '#000',
            border: '2px solid #555',
            display: 'flex',
            flexDirection: 'column',
            padding: '8px',
            overflowY: 'auto',
            cursor: 'text',
          }}
          onClick={(e) => e.stopPropagation()} // still prevent fall‐through when clicking inside
        >
          {/* Terminal Title Bar */}
          <div
            style={{
              height: '25px',
              background: '#222',
              display: 'flex',
              alignItems: 'center',
              padding: '0 8px',
              color: '#0f0',
              fontSize: '13px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            user@machine:~$
          </div>

          {/* Terminal Content */}
          <div
            style={{
              flex: 1,
              padding: '8px',
              fontSize: '14px',
              lineHeight: '1.4em',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <pre style={{ color: '#0f0', margin: 0 }}>
{`Last login: Fri Jun  6 10:32:45 on pts/0
user@machine:~$ ls
Desktop  Documents  Downloads  Music  Pictures  Public  Templates  Videos
user@machine:~$ uname -a
Linux machine 4.19.0-16-amd64 #1 SMP Debian 4.19.181-1 (2021-03-19) x86_64 GNU/Linux
user@machine:~$ `}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
