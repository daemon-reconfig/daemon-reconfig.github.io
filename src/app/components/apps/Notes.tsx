// src/app/components/apps/NotesApp.tsx
'use client';

import React, { useState, useEffect } from 'react';
import styles from '../LinuxDesktop.module.css';

const STORAGE_KEY = 'my-desktop-notes';

export default function NotesApp() {
  const [text, setText] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setText(stored);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, text);
  }, [text]);

  return (
    <textarea
      className={styles.notesTextarea}
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Start typing notes..."
    />
  );
}
