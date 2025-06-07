// src/app/components/apps/TerminalApp.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from '../LinuxDesktop.module.css';

export default function TerminalApp() {
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => textareaRef.current?.focus(), []);

  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (trimmed === 'help') {
      return 'Available commands: help, echo [text], date';
    } else if (trimmed.startsWith('echo ')) {
      return cmd.slice(5);
    } else if (trimmed === 'date') {
      return new Date().toString();
    } else {
      return `bash: ${cmd}: command not found`;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const result = runCommand(input);
      setHistory((h) => {
        const next = [...h, `$ ${input}`, result];
        // keep only last 100 lines
        return next.slice(-100);
      });
      setInput('');
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
