'use client';

import React, { useEffect, useMemo, useState } from 'react';

function formatClock(date: Date) {
  return date.toLocaleTimeString('en-US', { hour12: false });
}

export default function HUDOverlay() {
  const [now, setNow] = useState(new Date());
  const [fps, setFps] = useState(60);
  const [signal, setSignal] = useState(92);

  useEffect(() => {
    let last = performance.now();
    let raf = 0;

    const tick = () => {
      const current = performance.now();
      const delta = Math.max(1, current - last);
      last = current;
      const frameFps = Math.min(144, Math.round(1000 / delta));
      setFps((prev) => Math.round(prev * 0.85 + frameFps * 0.15));
      raf = requestAnimationFrame(tick);
    };

    const clock = setInterval(() => {
      setNow(new Date());
      setSignal((v) => Math.max(70, Math.min(99, v + (Math.random() > 0.5 ? 1 : -1))));
    }, 1000);

    raf = requestAnimationFrame(tick);
    return () => {
      clearInterval(clock);
      cancelAnimationFrame(raf);
    };
  }, []);

  const health = 86;
  const vitality = 73;

  const healthGaugeStyle: React.CSSProperties & Record<string, string> = {
    '--gauge-percent': `${health}%`,
  };
  const vitalityGaugeStyle: React.CSSProperties & Record<string, string> = {
    '--gauge-percent': `${vitality}%`,
  };

  const telemetry = useMemo(
    () => [
      `FPS ${fps}`,
      `SIG ${signal}%`,
      `TIME ${formatClock(now)}`,
      `COORD X:12.4 Y:0.6 Z:-2.8`,
    ],
    [fps, signal, now]
  );

  return (
    <div style={styles.container}>
      <style>{`
        .helmet-shell { position:absolute; inset:8px; border-radius:28px; border:2px solid rgba(0,255,213,.34); box-shadow: inset 0 0 45px rgba(0,255,213,.12), 0 0 45px rgba(18,132,255,.12); }
        .helmet-shell::before { content:''; position:absolute; inset:10px 6%; border-top:1px solid rgba(0,255,225,.32); border-bottom:1px solid rgba(0,255,225,.25); border-radius:12px; }
        .helmet-cheek { position:absolute; top:35%; width:140px; height:220px; border:1px solid rgba(123,255,241,.3); background:linear-gradient(180deg, rgba(0,40,52,.18), rgba(0,0,0,0)); filter: drop-shadow(0 0 14px rgba(0,255,238,.2)); }
        .helmet-cheek.left { left:16px; clip-path: polygon(0 5%, 100% 0, 72% 100%, 0 95%); }
        .helmet-cheek.right { right:16px; clip-path: polygon(0 0, 100% 5%, 100% 95%, 28% 100%); }
        .visor-arcs { position:absolute; inset:0; }
        .visor-arc { position:absolute; left:50%; transform:translateX(-50%); border:1px solid rgba(101,246,255,.35); border-top:none; border-radius:0 0 999px 999px; }
        .visor-arc.a { top:34px; width:78%; height:110px; }
        .visor-arc.b { top:48px; width:64%; height:86px; border-color: rgba(101,246,255,.22); }
        .scanlines { position:absolute; inset:0; background:repeating-linear-gradient(180deg, rgba(138,255,250,.05) 0 2px, transparent 2px 5px); mix-blend-mode:screen; }
        .hud-vignette { position:absolute; inset:0; background:radial-gradient(circle at center, rgba(0,0,0,0) 50%, rgba(0,0,0,.87) 100%); }
        .gauge { position:absolute; width:110px; height:110px; border-radius:50%; background:conic-gradient(#003300 0%, #00FFB0 var(--gauge-percent), rgba(0,0,0,.25) var(--gauge-percent), rgba(0,0,0,.25) 100%); box-shadow:0 0 12px rgba(0,255,176,.6), inset 0 0 8px rgba(0,255,176,.4); display:flex; align-items:center; justify-content:center; }
        .gauge::before { content:''; position:absolute; width:72px; height:72px; border-radius:50%; background:rgba(0,0,0,.82); border:2px solid #00FFB0; }
        .gauge-text { position:relative; color:#00FFB0; font: bold 1rem Eurostile, sans-serif; }
        .gauge-health { top:24px; left:24px; }
        .gauge-vitality { top:24px; right:24px; }
        .telemetry { position:absolute; bottom:18px; right:20px; color:#9ffaff; border:1px solid rgba(105,246,255,.5); background:rgba(2,12,24,.7); font: 600 .72rem monospace; padding:8px 10px; min-width:220px; line-height:1.6; letter-spacing:.08em; }
        .status-strip { position:absolute; left:50%; transform:translateX(-50%); top:18px; color:#9df9ff; border:1px solid rgba(109,255,255,.45); background:rgba(2,12,22,.72); padding:5px 12px; font:600 .7rem monospace; letter-spacing:.14em; }
        .crosshair { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); }
      `}</style>
      <div className="hud-vignette" />
      <div className="scanlines" />
      <div className="helmet-shell" />
      <div className="helmet-cheek left" />
      <div className="helmet-cheek right" />
      <div className="visor-arcs">
        <div className="visor-arc a" />
        <div className="visor-arc b" />
      </div>
      <div className="status-strip">HELMET ONLINE // VISOR SEALED // O₂ 98%</div>
      <div className="gauge gauge-health" style={healthGaugeStyle}>
        <div className="gauge-text">{health}%</div>
      </div>
      <div className="gauge gauge-vitality" style={vitalityGaugeStyle}>
        <div className="gauge-text">{vitality}%</div>
      </div>
      <div className="telemetry">
        {telemetry.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
      <svg className="crosshair" viewBox="0 0 40 40" width={40} height={40}>
        <circle cx={20} cy={20} r={12} stroke="#00FFB0" fill="none" />
        <line x1={20} y1={8} x2={20} y2={0} stroke="#00FFB0" />
        <line x1={20} y1={32} x2={20} y2={40} stroke="#00FFB0" />
        <line x1={8} y1={20} x2={0} y2={20} stroke="#00FFB0" />
        <line x1={32} y1={20} x2={40} y2={20} stroke="#00FFB0" />
      </svg>
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
