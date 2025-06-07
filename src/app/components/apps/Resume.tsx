// src/app/components/apps/ResumeApp.tsx
'use client';

import React from 'react';
import styles from '../LinuxDesktop.module.css';

export default function ResumeApp() {
  return (
    <iframe
      src="/resume.pdf"
      className={styles.resumeIframe}
      title="Resume"
    />
  );
}
