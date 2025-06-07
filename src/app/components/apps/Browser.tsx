// src/app/components/apps/BrowserApp.tsx
'use client';

import React from 'react';
import styles from '../LinuxDesktop.module.css';

export default function BrowserApp() {
  return (
    <iframe
      src="https://www.example.com"
      className={styles.browserIframe}
      title="Browser"
    />
  );
}
