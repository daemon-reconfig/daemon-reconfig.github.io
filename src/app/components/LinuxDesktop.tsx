// src/app/components/LinuxDesktop.tsx
'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import styles from './LinuxDesktop.module.css';
import BrowserApp from './apps/Browser';
import NotesApp from './apps/Notes';
import ResumeApp from './apps/Resume';
import TerminalApp from './apps/Terminal';


type AppType = 'terminal' | 'notes' | 'browser' | 'resume';

// Heights of our fixed bars
const TOP_BAR_HEIGHT = 32;
const TASK_BAR_HEIGHT = 40;

interface WindowData {
  id: number;
  type: AppType;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isFullscreen: boolean;
  isMinimized: boolean;
}

const APP_DEFINITIONS: Record<AppType, { label: string; icon: string }> = {
  terminal: { label: 'Terminal', icon: '💻' },
  notes:    { label: 'Notes',    icon: '📝' },
  browser:  { label: 'Browser',  icon: '🌐' },
  resume:   { label: 'Resume',   icon: '📄' },
};

let globalZIndex = 1;

export default function LinuxDesktop() {
  const router = useRouter();
  const [openWindows, setOpenWindows] = useState<WindowData[]>([]);

  // Open (or launch) a window
  const openApp = useCallback((type: AppType) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw <= 600;

    const winWidth  = isMobile ? vw * 0.9 : 400;
    const winHeight = isMobile ? vh * 0.8 : 300;
    const isFullscreen = type === 'resume';
    const isMinimized  = false;

    const x = isFullscreen
      ? 0
      : (vw - winWidth) / 2;
    const y = isFullscreen
      ? TOP_BAR_HEIGHT
      : (vh - winHeight) / 2;

    const height = isFullscreen
      ? vh - TOP_BAR_HEIGHT - TASK_BAR_HEIGHT
      : winHeight;

    setOpenWindows(ws => [
      ...ws,
      {
        id: Date.now(),
        type,
        zIndex: ++globalZIndex,
        position: { x, y },
        size:     { width: winWidth, height },
        isFullscreen,
        isMinimized,
      },
    ]);
  }, []);

  // Close entirely
  const closeWindow = useCallback((id: number) => {
    setOpenWindows(ws => ws.filter(w => w.id !== id));
  }, []);

  // Bring to front
  const focusWindow = useCallback((id: number) => {
    setOpenWindows(ws =>
      ws.map(w =>
        w.id === id ? { ...w, zIndex: ++globalZIndex } : w
      )
    );
  }, []);

  // Minimize (hide)
  const minimizeWindow = useCallback((id: number) => {
    setOpenWindows(ws =>
      ws.map(w =>
        w.id === id ? { ...w, isMinimized: true } : w
      )
    );
  }, []);

  // Restore (un-minimize) and focus
  const activateWindow = useCallback((id: number) => {
    setOpenWindows(ws =>
      ws.map(w =>
        w.id === id
          ? { ...w, isMinimized: false, zIndex: ++globalZIndex }
          : w
      )
    );
  }, []);

  // Toggle fullscreen / restore
  const toggleFullscreen = useCallback((id: number) => {
    setOpenWindows(ws =>
      ws.map(w => {
        if (w.id !== id) return w;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        if (!w.isFullscreen) {
          // go full-screen
          return {
            ...w,
            isFullscreen: true,
            position: { x: 0, y: TOP_BAR_HEIGHT },
            size:     { width: vw, height: vh - TOP_BAR_HEIGHT - TASK_BAR_HEIGHT },
          };
        } else {
          // restore centered
          const isMobile = vw <= 600;
          const winWidth  = isMobile ? vw * 0.9 : 400;
          const winHeight = isMobile ? vh * 0.8 : 300;
          const x = (vw - winWidth) / 2;
          const y = (vh - winHeight) / 2;
          return {
            ...w,
            isFullscreen: false,
            position: { x, y },
            size:     { width: winWidth, height: winHeight },
          };
        }
      })
    );
  }, []);

  const icons: AppType[] = useMemo(
    () => ['terminal', 'notes', 'browser', 'resume'],
    []
  );

  // ─── Top Status Bar ───────────────────────────────────────────────────────────
  const TopBar = () => {
    const [now, setNow] = useState(new Date());
    const [cpu, setCpu] = useState<number[]>([]);

    // update clock
    useEffect(() => {
      const tid = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(tid);
    }, []);

    // simulate CPU usage
    useEffect(() => {
      const tid = setInterval(() => {
        setCpu(prev => [...prev.slice(-29), Math.floor(Math.random() * 100)]);
      }, 1000);
      return () => clearInterval(tid);
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

  // ─── Bottom Task Bar ──────────────────────────────────────────────────────────
  const TaskBar = () => (
    <div className={styles.taskBar}>
      {openWindows.map(w => (
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
        {icons.map(appType => (
          <div
            key={appType}
            className={styles.icon}
            role="button"
            tabIndex={0}
            onClick={() => openApp(appType)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') openApp(appType);
            }}
          >
            <div className={styles.iconEmoji}>
              {APP_DEFINITIONS[appType].icon}
            </div>
            <div className={styles.iconLabel}>
              {APP_DEFINITIONS[appType].label}
            </div>
          </div>
        ))}
      </div>

      {/* render only non-minimized windows */}
      {openWindows.map(w =>
        !w.isMinimized ? (
          <MemoizedWindow
            key={w.id}
            data={w}
            onClose={() => closeWindow(w.id)}
            onFocus={() => focusWindow(w.id)}
            onMinimize={() => minimizeWindow(w.id)}
            onToggleFullscreen={() => toggleFullscreen(w.id)}
          />
        ) : null
      )}

      <TaskBar />
    </div>
  );
}

// ─── Window Component ───────────────────────────────────────────────────────────
interface WindowProps {
  data: WindowData;
  onClose: () => void;
  onFocus: () => void;
  onMinimize: () => void;
  onToggleFullscreen: () => void;
}
const Window: React.FC<WindowProps> = ({
  data,
  onClose,
  onFocus,
  onMinimize,
  onToggleFullscreen,
}) => {
  const { type, zIndex, position, size, isFullscreen } = data;
  const windowRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const lastMove = useRef(0);
  const [pos, setPos] = useState(position);

  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFullscreen) {
      onFocus();
      const rect = windowRef.current!.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setDragging(true);
    }
  };

  // drag handler
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      const now = performance.now();
      if (now - lastMove.current < 16) return;
      lastMove.current = now;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let newX = e.clientX - dragOffset.current.x;
      let newY = e.clientY - dragOffset.current.y;
      newX = Math.max(0, Math.min(newX, vw - size.width));
      newY = Math.max(TOP_BAR_HEIGHT, Math.min(newY, vh - size.height - TASK_BAR_HEIGHT));
      setPos({ x: newX, y: newY });
    };
    const onMouseUp = () => setDragging(false);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, size, data]);

  const content = useMemo(() => {
    switch (type) {
      case 'terminal': return <TerminalApp />;
      case 'notes':    return <NotesApp />;
      case 'browser':  return <BrowserApp />;
      case 'resume':   return <ResumeApp />;
    }
  }, [type]);

  return createPortal(
    <div
      ref={windowRef}
      className={styles.window}
      style={{
        top:  isFullscreen ? TOP_BAR_HEIGHT : pos.y,
        left: isFullscreen ? 0            : pos.x,
        zIndex,
        width:  size.width,
        height: size.height,
        cursor: isFullscreen ? 'default' : undefined,
      }}
      onMouseDown={() => onFocus()}
    >
      <div className={styles.titleBar} onMouseDown={onMouseDown}>
        <div className={styles.windowControls}>
          {/* red = close */}
          <button
            className={styles.control}
            style={{ background: '#ff605c' }}
            onClick={onClose}
          />
          {/* yellow = minimize */}
          <button
            className={styles.control}
            style={{ background: '#ffbd44' }}
            onClick={onMinimize}
          />
          {/* green = fullscreen */}
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
      <div className={styles.windowContent}>{content}</div>
    </div>,
    document.body
  );
};

const MemoizedWindow = React.memo(Window);
