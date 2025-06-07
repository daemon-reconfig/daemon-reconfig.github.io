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
import styles from './LinuxDesktop.module.css';
import TerminalApp from './apps/Terminal';
import NotesApp from './apps/Notes';
import BrowserApp from './apps/Browser';
import ResumeApp from './apps/Resume';


type AppType = 'terminal' | 'notes' | 'browser' | 'resume';

interface WindowData {
  id: number;
  type: AppType;
  zIndex: number;
  // initial position
  position: { x: number; y: number };
  // window size
  size: { width: number; height: number };
}

const APP_DEFINITIONS: Record<AppType, { label: string; icon: string }> = {
  terminal: { label: 'Terminal', icon: '💻' },
  notes:    { label: 'Notes',    icon: '📝' },
  browser:  { label: 'Browser',  icon: '🌐' },
  resume:   { label: 'Resume',   icon: '📄' },
};

let globalZIndex = 1;

export default function LinuxDesktop() {
  const [openWindows, setOpenWindows] = useState<WindowData[]>([]);

  // Launch an app, computing centered size/position
  const openApp = useCallback((type: AppType) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // On mobile, use 90% width / 80% height; on desktop, fixed 400×300
    const isMobile = vw <= 600;
    const winWidth  = isMobile ? vw * 0.9 : 400;
    const winHeight = isMobile ? vh * 0.8 : 300;

    const x = (vw - winWidth) / 2;
    const y = (vh - winHeight) / 2;

    setOpenWindows((ws) => [
      ...ws,
      {
        id: Date.now(),
        type,
        zIndex: ++globalZIndex,
        position: { x, y },
        size:     { width: winWidth, height: winHeight },
      },
    ]);
  }, []);

  const closeWindow = useCallback((id: number) => {
    setOpenWindows((ws) => ws.filter((w) => w.id !== id));
  }, []);

  const focusWindow = useCallback((id: number) => {
    setOpenWindows((ws) =>
      ws.map((w) =>
        w.id === id
          ? { ...w, zIndex: ++globalZIndex }
          : w
      )
    );
  }, []);

  const icons: AppType[] = useMemo(
    () => ['terminal', 'notes', 'browser', 'resume'],
    []
  );

  return (
    <div className={styles.desktop}>
      <div className={styles.iconContainer}>
        {icons.map((appType) => (
          <div
            key={appType}
            className={styles.icon}
            role="button"
            tabIndex={0}
            onClick={() => openApp(appType)}
            onKeyDown={(e) => {
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

      {openWindows.map((win) => (
        <MemoizedWindow
          key={win.id}
          data={win}
          onClose={() => closeWindow(win.id)}
          onFocus={() => focusWindow(win.id)}
        />
      ))}
    </div>
  );
}

interface WindowProps {
  data: WindowData;
  onClose: () => void;
  onFocus: () => void;
}

const Window: React.FC<WindowProps> = ({ data, onClose, onFocus }) => {
  const { type, zIndex, position, size } = data;
  const windowRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(position);
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastMove = useRef(0);

  
  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFocus();
    const rect = windowRef.current!.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setDragging(true);
  };


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
      newY = Math.max(0, Math.min(newY, vh - size.height));

      setPos({ x: newX, y: newY });
    };
    const onMouseUp = () => setDragging(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, size.width, size.height]);

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
        top: pos.y,
        left: pos.x,
        zIndex,
        width: size.width,
        height: size.height,
        cursor: 'url(/cursor-futuristic.cur) 8 8, crosshair'
      }}
      onMouseDown={() => onFocus()}
    >
      <div className={styles.titleBar} onMouseDown={onMouseDown}>
        <div className={styles.titleText}>
          {APP_DEFINITIONS[type].label}
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
      </div>
      <div className={styles.windowContent}>{content}</div>
    </div>,
    document.body
  );
};

const MemoizedWindow = React.memo(Window);
