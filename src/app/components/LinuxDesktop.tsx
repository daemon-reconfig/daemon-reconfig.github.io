// src/app/components/LinuxDesktop.tsx
'use client';

import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import styles from './LinuxDesktop.module.css';

import {
  useDesktopStore,
  WindowData,
  AppType,
  DesktopStore,
} from '../store/useDesktop';
import BrowserApp from './apps/Browser';
import NotesApp from './apps/Notes';
import ResumeApp from './apps/Resume';
import TerminalApp from './apps/Terminal';

// ← Add these two constants so they’re available everywhere in this file
const TOP_BAR_HEIGHT = 32;
const TASK_BAR_HEIGHT = 40;

const APP_DEFINITIONS: Record<AppType, { label: string; icon: string }> = {
  terminal: { label: 'Terminal', icon: '💻' },
  notes:    { label: 'Notes',    icon: '📝' },
  browser:  { label: 'Browser',  icon: '🌐' },
  resume:   { label: 'Resume',   icon: '📄' },
};

export default function LinuxDesktop() {
  const router = useRouter();

  // Zustand selectors
  const windows          = useDesktopStore((state: DesktopStore) => state.windows);
  const openWindow       = useDesktopStore((state: DesktopStore) => state.openWindow);
  const closeWindow      = useDesktopStore((state: DesktopStore) => state.closeWindow);
  const focusWindow      = useDesktopStore((state: DesktopStore) => state.focusWindow);
  const minimizeWindow   = useDesktopStore((state: DesktopStore) => state.minimizeWindow);
  const activateWindow   = useDesktopStore((state: DesktopStore) => state.activateWindow);
  const toggleFullscreen = useDesktopStore((state: DesktopStore) => state.toggleFullscreen);
  const moveWindow       = useDesktopStore((state: DesktopStore) => state.moveWindow);

  const icons: AppType[] = useMemo(
    () => ['terminal', 'notes', 'browser', 'resume'],
    []
  );

  // ─── Top Status Bar ─────────────────────────────────────────────────────
  const TopBar = () => {
    const [now, setNow] = useState(new Date());
    const [cpu, setCpu] = useState<number[]>([]);

    useEffect(() => {
      const ti = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(ti);
    }, []);

    useEffect(() => {
      const ci = setInterval(() => {
        setCpu(prev => [...prev.slice(-29), Math.floor(Math.random() * 100)]);
      }, 1000);
      return () => clearInterval(ci);
    }, []);

    return (
      <div className={styles.topBar}>
        <div className={styles.time}>{now.toLocaleTimeString()}</div>
        <div className={styles.cpuGraph}>
          {cpu.map((val, i) => (
            <div
              key={i}
              className={styles.cpuBar}
              style={{ height: `${val}%` }}
            />
          ))}
        </div>
        <button
          className={styles.shutdownBtn}
          onClick={() => router.push('/')}
        >
          ⏻
        </button>
      </div>
    );
  };

  // ─── Bottom Task Bar ────────────────────────────────────────────────────
  const TaskBar = () => (
    <div className={styles.taskBar}>
      {windows.map((w: WindowData) => (
        <div
          key={w.id}
          className={styles.taskIcon}
          onClick={() => activateWindow(w.id)}
        >
          {APP_DEFINITIONS[w.type].icon}
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.desktop}>
      <TopBar />

      <div className={styles.iconContainer}>
        {icons.map((type: AppType) => (
          <div
            key={type}
            className={styles.icon}
            role="button"
            tabIndex={0}
            onClick={() => openWindow(type)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') openWindow(type);
            }}
          >
            <div className={styles.iconEmoji}>
              {APP_DEFINITIONS[type].icon}
            </div>
            <div className={styles.iconLabel}>
              {APP_DEFINITIONS[type].label}
            </div>
          </div>
        ))}
      </div>

      {windows.map((w: WindowData) =>
        !w.isMinimized ? (
          <Window
            key={w.id}
            data={w}
            onClose={() => closeWindow(w.id)}
            onFocus={() => focusWindow(w.id)}
            onMinimize={() => minimizeWindow(w.id)}
            onToggleFullscreen={() => toggleFullscreen(w.id)}
            onDrag={pos => moveWindow(w.id, pos)}
          />
        ) : null
      )}

      <TaskBar />
    </div>
  );
}

// ─── Window Component ─────────────────────────────────────────────────────
interface WindowProps {
  data: WindowData;
  onClose(): void;
  onFocus(): void;
  onMinimize(): void;
  onToggleFullscreen(): void;
  onDrag(pos: { x: number; y: number }): void;
}

const Window: React.FC<WindowProps> = ({
  data,
  onClose,
  onFocus,
  onMinimize,
  onToggleFullscreen,
  onDrag,
}) => {
  const { type, zIndex, position, size, isFullscreen } = data;
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const last = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFullscreen) {
      onFocus();
      const rect = ref.current!.getBoundingClientRect();
      offset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setDragging(true);
    }
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      const now = performance.now();
      if (now - last.current < 16) return;
      last.current = now;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let x = e.clientX - offset.current.x;
      let y = e.clientY - offset.current.y;

      // clamp into viewport, accounting for bars
      x = Math.max(0, Math.min(x, vw - size.width));
      y = Math.max(
        TOP_BAR_HEIGHT,
        Math.min(y, vh - size.height - TASK_BAR_HEIGHT)
      );

      onDrag({ x, y });
    };
    const onMouseUp = () => setDragging(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, size, onDrag]);

  const Content = useMemo(() => {
    switch (type) {
      case 'terminal': return <TerminalApp />;
      case 'notes':    return <NotesApp />;
      case 'browser':  return <BrowserApp />;
      case 'resume':   return <ResumeApp />;
    }
  }, [type]);

  return createPortal(
    <div
      ref={ref}
      className={styles.window}
      style={{
        top:    isFullscreen ? TOP_BAR_HEIGHT : position.y,
        left:   isFullscreen ? 0              : position.x,
        width:  size.width,
        height: size.height,
        zIndex,
        cursor: isFullscreen ? 'default' : undefined,
      }}
      onMouseDown={() => onFocus()}
    >
      <div className={styles.titleBar} onMouseDown={onMouseDown}>
        <div className={styles.windowControls}>
          <button
            className={styles.control}
            style={{ background: '#ff605c' }}
            onClick={onClose}
          />
          <button
            className={styles.control}
            style={{ background: '#ffbd44' }}
            onClick={onMinimize}
          />
          <button
            className={styles.control}
            style={{ background: '#00ca4e' }}
            onClick={onToggleFullscreen}
          />
        </div>
        <div className={styles.titleText}>
          {APP_DEFINITIONS[type].label}
        </div>
      </div>
      <div className={styles.windowContent}>{Content}</div>
    </div>,
    document.body
  );
};
