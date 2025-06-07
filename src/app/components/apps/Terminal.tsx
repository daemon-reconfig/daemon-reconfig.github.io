// src/app/components/apps/TerminalApp.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from '../LinuxDesktop.module.css';
import { useDesktopStore, AppType } from '@/app/store/useDesktop';


const SUPPORTED_APPS: AppType[] = ['terminal', 'notes', 'browser', 'resume'];

export default function TerminalApp() {
  const openWindow = useDesktopStore((s) => s.openWindow);

  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    const lower = trimmed.toLowerCase();

    // HELP
    if (lower === 'help') {
      return [
        'Available commands:',
        '• help',
        '• echo [text]',
        '• date',
        '• open [terminal|notes|browser|resume]',
      ].join('\n');
    }

    // ECHO
    if (lower.startsWith('echo ')) {
      return trimmed.slice(5);
    }

    // DATE
    if (lower === 'date') {
      return new Date().toString();
    }

    // OPEN command
    if (lower.startsWith('open ')) {
      const appName = lower.slice(5) as AppType;
      if (SUPPORTED_APPS.includes(appName)) {
        openWindow(appName);
        return `Opening ${appName}...`;
      } else {
        return `bash: ${appName}: no such app`;
      }
    }

    // Shortcut: just typing the app name
    if (SUPPORTED_APPS.includes(lower as AppType)) {
      openWindow(lower as AppType);
      return `Opening ${lower}...`;
    }

    // Unknown
    return `bash: ${trimmed}: command not found`;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const result = runCommand(input);
      setHistory((h) => [...h, `$ ${input}`, result]);
      setInput('');
      // scroll to bottom
      setTimeout(() => {
        const ta = textareaRef.current;
        if (ta) ta.scrollTop = ta.scrollHeight;
      }, 0);
    }
  };

  return (
    <div className={styles.terminalContainer}>
      <div className={styles.terminalHistory}>
        {history.map((line, i) => (
          <div key={i} className={styles.terminalLine}>
            {line}
          </div>
        ))}
      </div>
      <div className={styles.terminalInput}>
        <span className={styles.prompt}>$</span>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
          className={styles.terminalTextarea}
        />
      </div>
    </div>
  );
}
