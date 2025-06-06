// src/app/components/HUDOverlay.tsx
'use client';

import React from 'react';

/**
 * Sci-Fi HUD overlay with:
 *  • Circular Health & Vitality gauges
 *  • Spinning vinyl record for “Now Playing”
 *  • Centered glowing crosshair
 *  • Darkened edges/vignette
 *
 * Replace `health`, `vitality`, and `trackName` with real game data.
 */
export default function HUDOverlay() {
  const health = 75;            // 0–100
  const vitality = 50;          // 0–100
  const trackName = 'Nebula Drift'; // example track title

  return (
    <div style={styles.container}>
      {/* Inline CSS for animations and styling */}
      <style>{`
        /* ──────────────────── Vignette / Visor Effect ──────────────────── */
        .hud-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at center,
            rgba(0, 0, 0, 0) 60%,
            rgba(0, 0, 0, 0.7) 100%
          );
          pointer-events: none;
          z-index: 1;
        }

        /* ──────────────────── Circular Gauge Base ──────────────────── */
        .gauge {
          position: absolute;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: conic-gradient(
            #003300 0%,
            #00FF41 var(--gauge-percent),
            rgba(0, 0, 0, 0.2) var(--gauge-percent),
            rgba(0, 0, 0, 0.2) 100%
          );
          box-shadow: 0 0 12px rgba(0, 255, 65, 0.6),
                      inset 0 0 8px rgba(0, 255, 65, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .gauge::before {
          content: '';
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.8);
          border: 2px solid #00FF41;
          box-shadow: inset 0 0 4px rgba(0, 255, 65, 0.7);
        }

        .gauge-text {
          position: relative;
          font-family: Eurostile, sans-serif;
          color: #00FF41;
          font-size: 1.2rem;
          font-weight: bold;
          z-index: 3;
        }

        /* Positioning for Health (left) and Vitality (right) gauges */
        .gauge-health {
          top: 20px;
          left: 20px;
        }
        .gauge-vitality {
          top: 20px;
          right: 20px;
        }

        /* ──────────────────── Spinning Vinyl Widget ──────────────────── */
        .vinyl-container {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 120px;
          pointer-events: none;
          z-index: 2;
        }

        .vinyl-record {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle at 50% 50%,
            #111 0%,
            #222 20%,
            #000 40%,
            #111 100%
          );
          box-shadow: 0 0 8px rgba(0, 255, 65, 0.4),
                      inset 0 0 4px rgba(0, 0, 0, 0.7);
          animation: vinyl-spin 8s linear infinite;
        }

        .vinyl-label {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 50px;
          height: 50px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: #00FF41;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: Eurostile, sans-serif;
          font-size: 0.6rem;
          color: #000;
          text-align: center;
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
        }

        .vinyl-name {
          position: absolute;
          bottom: -24px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.7);
          color: #00FF41;
          font-family: Eurostile, sans-serif;
          font-size: 0.75rem;
          padding: 2px 6px;
          border: 1px solid #00FF41;
          border-radius: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 140px;
        }

        /* ──────────────────── Glowing Crosshair ──────────────────── */
        .crosshair {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 40px;
          height: 40px;
          transform: translate(-50%, -50%) rotate(0deg);
          animation: crosshair-rotate 6s linear infinite;
          z-index: 3;
          pointer-events: none;
        }

        .crosshair circle {
          cx: 20;
          cy: 20;
          r: 12;
          stroke: #00FF41;
          stroke-width: 2;
          fill: none;
          opacity: 0.8;
          animation: crosshair-pulse 2s ease-in-out infinite alternate;
        }

        .crosshair line {
          stroke: #00FF41;
          stroke-width: 2;
          opacity: 0.8;
        }

        /* ──────────────────── Animations ──────────────────── */
        @keyframes vinyl-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes crosshair-rotate {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes crosshair-pulse {
          0% { stroke-width: 2; opacity: 0.8; }
          100% { stroke-width: 4; opacity: 0.4; }
        }
      `}</style>

      {/* 1) Darkened Vignette / Visor */}
      <div className="hud-vignette" />

      {/* 2) Health Gauge */}
      <div
        className="gauge gauge-health"
        style={
          // Cast to any so that --gauge-percent is accepted
          ({ '--gauge-percent': `${health}%` } as any)
        }
      >
        <div className="gauge-text">{health}%</div>
      </div>

      {/* 3) Vitality Gauge */}
      <div
        className="gauge gauge-vitality"
        style={
          ({ '--gauge-percent': `${vitality}%` } as any)
        }
      >
        <div className="gauge-text">{vitality}%</div>
      </div>

      {/* 4) Spinning Vinyl “Now Playing” */}
      <div className="vinyl-container">
        <div className="vinyl-record" />
        <div className="vinyl-label">VINYL</div>
        <div className="vinyl-name">{trackName}</div>
      </div>

      {/* 5) Glowing, Rotating Crosshair */}
      <svg className="crosshair" viewBox="0 0 40 40" width={40} height={40}>
        <circle cx={20} cy={20} r={12} />
        <line x1={20} y1={8} x2={20} y2={0} />
        <line x1={20} y1={32} x2={20} y2={40} />
        <line x1={8} y1={20} x2={0} y2={20} />
        <line x1={32} y1={20} x2={40} y2={20} />
      </svg>
    </div>
  );
}

// Inline style for the container
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none', // allow clicks to pass through
    zIndex: 999,
    overflow: 'hidden',
  },
};
