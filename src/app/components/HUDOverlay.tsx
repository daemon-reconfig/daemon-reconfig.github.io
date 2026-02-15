'use client';

import React from 'react';

export default function HUDOverlay() {
  const health = 75;
  const vitality = 50;
  const trackName = 'Neon Run';

  const healthGaugeStyle: React.CSSProperties & Record<string, string> = {
    '--gauge-percent': `${health}%`,
  };
  const vitalityGaugeStyle: React.CSSProperties & Record<string, string> = {
    '--gauge-percent': `${vitality}%`,
  };

  return (
    <div style={styles.container}>
      <style>{`
        .helmet-frame { position:absolute; inset:10px; border: 2px solid rgba(0,255,200,.3); border-radius: 24px; box-shadow: inset 0 0 30px rgba(0,255,200,.15), 0 0 40px rgba(0,90,170,.12); }
        .helmet-frame::before, .helmet-frame::after { content:''; position:absolute; top:50%; width:18%; height:1px; background:rgba(0,255,200,.35); }
        .helmet-frame::before { left:0; }
        .helmet-frame::after { right:0; }
        .helmet-frame .visor-line { position:absolute; left:10%; right:10%; height:1px; background:linear-gradient(90deg, transparent, rgba(140,250,255,.7), transparent); }
        .visor-top { top:18%; }
        .visor-bottom { bottom:18%; }
        .helmet-corners { position:absolute; inset:0; }
        .helmet-corner { position:absolute; width:40px; height:40px; border:2px solid rgba(110,255,255,.4); }
        .helmet-corner.tl { top:24px; left:24px; border-right:none; border-bottom:none; }
        .helmet-corner.tr { top:24px; right:24px; border-left:none; border-bottom:none; }
        .helmet-corner.bl { bottom:24px; left:24px; border-right:none; border-top:none; }
        .helmet-corner.br { bottom:24px; right:24px; border-left:none; border-top:none; }
        .hud-vignette { position:absolute; inset:0; background:radial-gradient(circle at center, rgba(0,0,0,0) 52%, rgba(0,0,0,.82) 100%); }
        .scanlines { position:absolute; inset:0; background:repeating-linear-gradient(180deg, rgba(130,255,255,0.04) 0 2px, transparent 2px 5px); mix-blend-mode:screen; }
        .helmet-frame { position:absolute; inset:10px; border: 2px solid rgba(0,255,200,.3); border-radius: 24px; box-shadow: inset 0 0 30px rgba(0,255,200,.15); }
        .helmet-frame::before, .helmet-frame::after { content:''; position:absolute; top:50%; width:18%; height:1px; background:rgba(0,255,200,.35); }
        .helmet-frame::before { left:0; }
        .helmet-frame::after { right:0; }
        .hud-vignette { position:absolute; inset:0; background:radial-gradient(circle at center, rgba(0,0,0,0) 55%, rgba(0,0,0,.75) 100%); }
        .gauge { position:absolute; width:120px; height:120px; border-radius:50%; background:conic-gradient(#003300 0%, #00FFB0 var(--gauge-percent), rgba(0,0,0,.25) var(--gauge-percent), rgba(0,0,0,.25) 100%); box-shadow:0 0 12px rgba(0,255,176,.6), inset 0 0 8px rgba(0,255,176,.4); display:flex; align-items:center; justify-content:center; }
        .gauge::before { content:''; position:absolute; width:78px; height:78px; border-radius:50%; background:rgba(0,0,0,.8); border:2px solid #00FFB0; }
        .gauge-text { position:relative; color:#00FFB0; font: bold 1.1rem Eurostile, sans-serif; }
        .gauge-health { top:20px; left:20px; }
        .gauge-vitality { top:20px; right:20px; }
        .vinyl-container { position:absolute; bottom:20px; left:50%; transform:translateX(-50%); width:120px; height:120px; }
        .vinyl-record { position:absolute; inset:0; border-radius:50%; background:radial-gradient(circle,#111 0%,#222 20%,#000 60%,#111 100%); animation:vinyl-spin 8s linear infinite; }
        .vinyl-name { position:absolute; bottom:-24px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,.7); color:#00FFB0; border:1px solid #00FFB0; padding:2px 6px; font-size:.75rem; }
        .crosshair { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); }
        .status-strip { position:absolute; left:50%; transform:translateX(-50%); top:18px; color:#9df9ff; border:1px solid rgba(109,255,255,.45); background:rgba(2,12,22,.7); padding:5px 12px; font:600 .7rem monospace; letter-spacing:.14em; }
        @keyframes vinyl-spin { from { transform:rotate(0deg);} to { transform:rotate(360deg);} }
      `}</style>
      <div className="hud-vignette" />
      <div className="scanlines" />
      <div className="helmet-frame">
        <div className="visor-line visor-top" />
        <div className="visor-line visor-bottom" />
      </div>
      <div className="helmet-corners">
        <div className="helmet-corner tl" />
        <div className="helmet-corner tr" />
        <div className="helmet-corner bl" />
        <div className="helmet-corner br" />
      </div>
      <div className="status-strip">HELMET LINK // STABLE // O₂ 98%</div>
        @keyframes vinyl-spin { from { transform:rotate(0deg);} to { transform:rotate(360deg);} }
      `}</style>
      <div className="hud-vignette" />
      <div className="helmet-frame" />
      <div className="gauge gauge-health" style={healthGaugeStyle}><div className="gauge-text">{health}%</div></div>
      <div className="gauge gauge-vitality" style={vitalityGaugeStyle}><div className="gauge-text">{vitality}%</div></div>
      <div className="vinyl-container"><div className="vinyl-record" /><div className="vinyl-name">{trackName}</div></div>
      <svg className="crosshair" viewBox="0 0 40 40" width={40} height={40}><circle cx={20} cy={20} r={12} stroke="#00FFB0" fill="none" /><line x1={20} y1={8} x2={20} y2={0} stroke="#00FFB0" /><line x1={20} y1={32} x2={20} y2={40} stroke="#00FFB0" /><line x1={8} y1={20} x2={0} y2={20} stroke="#00FFB0" /><line x1={32} y1={20} x2={40} y2={20} stroke="#00FFB0" /></svg>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 999,
    overflow: 'hidden',
  },
};
