// src/app/components/apps/ResumeApp.tsx
'use client';

import React from 'react';
import styles from '../LinuxDesktop.module.css';

export default function ResumeApp() {
  return (
    <iframe
      src="/Resume_Mehul_Sardana.pdf"
      className={styles.resumeIframe}
      title="Resume"
    />
  );
}
