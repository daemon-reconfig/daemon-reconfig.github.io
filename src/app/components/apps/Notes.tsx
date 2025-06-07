// src/app/components/apps/NotesApp.tsx
'use client';

import React, { useState } from 'react';
import styles from '../LinuxDesktop.module.css';

export default function NotesApp() {
  const [text, setText] = useState('');
  return (
    <textarea
      className={styles.notesTextarea}
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Start typing notes..."
    />
  );
}
