// src/app/store/useDesktopStore.ts
import { create } from 'zustand';

export type AppType = 'terminal' | 'notes' | 'browser' | 'resume';

export interface WindowData {
  id: number;
  type: AppType;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isFullscreen: boolean;
  isMinimized: boolean;
}

// Heights of our fixed UI bars
const TOP_BAR_HEIGHT = 32;
const TASK_BAR_HEIGHT = 40;

export interface DesktopStore {
  windows: WindowData[];
  openWindow: (type: AppType) => void;
  closeWindow: (id: number) => void;
  focusWindow: (id: number) => void;
  minimizeWindow: (id: number) => void;
  activateWindow: (id: number) => void;
  toggleFullscreen: (id: number) => void;
  moveWindow: (id: number, pos: { x: number; y: number }) => void;
}

export const useDesktopStore = create<DesktopStore>((set, get) => ({
  windows: [],

  openWindow: (type: AppType) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw <= 600;
    const winWidth  = isMobile ? vw * 0.9 : 400;
    const winHeight = isMobile ? vh * 0.8 : 300;
    const isFullscreen = type === 'resume';
    const x = isFullscreen
      ? 0
      : (vw - winWidth) / 2;
    const y = isFullscreen
      ? TOP_BAR_HEIGHT
      : (vh - winHeight) / 2;
    const height = isFullscreen
      ? vh - TOP_BAR_HEIGHT - TASK_BAR_HEIGHT
      : winHeight;

    // Determine next zIndex
    const maxZ = get().windows.reduce<number>(
      (m, w) => Math.max(m, w.zIndex),
      0
    );

    const newWin: WindowData = {
      id: Date.now(),
      type,
      zIndex: maxZ + 1,
      position: { x, y },
      size: { width: winWidth, height },
      isFullscreen,
      isMinimized: false,
    };

    set({ windows: [...get().windows, newWin] });
  },

  closeWindow: (id: number) => {
    set({ windows: get().windows.filter((w) => w.id !== id) });
  },

  focusWindow: (id: number) => {
    const maxZ = get().windows.reduce<number>(
      (m, w) => Math.max(m, w.zIndex),
      0
    );
    set({
      windows: get().windows.map((w) =>
        w.id === id ? { ...w, zIndex: maxZ + 1 } : w
      ),
    });
  },

  minimizeWindow: (id: number) => {
    set({
      windows: get().windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true } : w
      ),
    });
  },

  activateWindow: (id: number) => {
    const maxZ = get().windows.reduce<number>(
      (m, w) => Math.max(m, w.zIndex),
      0
    );
    set({
      windows: get().windows.map((w) =>
        w.id === id
          ? { ...w, isMinimized: false, zIndex: maxZ + 1 }
          : w
      ),
    });
  },

  toggleFullscreen: (id: number) => {
    set({
      windows: get().windows.map((w) => {
        if (w.id !== id) return w;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        if (!w.isFullscreen) {
          // go fullscreen
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
          return {
            ...w,
            isFullscreen: false,
            position: {
              x: (vw - winWidth) / 2,
              y: (vh - winHeight) / 2,
            },
            size: { width: winWidth, height: winHeight },
          };
        }
      }),
    });
  },

  moveWindow: (id: number, pos: { x: number; y: number }) => {
    set({
      windows: get().windows.map((w) =>
        w.id === id
          ? { ...w, position: { x: pos.x, y: pos.y } }
          : w
      ),
    });
  },
}));
