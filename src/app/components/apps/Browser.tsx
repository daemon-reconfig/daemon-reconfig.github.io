'use client';

import React, { useState } from 'react';
import styles from '../LinuxDesktop.module.css';

const QUICK_LINKS = [
  'https://example.com',
  'https://news.ycombinator.com',
  'https://wikipedia.org',
];

function normalizeUrl(value: string) {
  if (!value) return 'https://example.com';
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  return `https://${value}`;
}

export default function BrowserApp() {
  const [address, setAddress] = useState('https://example.com');
  const [html, setHtml] = useState('Loading...');
  const [loading, setLoading] = useState(false);

  const loadSite = async (raw: string) => {
    const url = normalizeUrl(raw.trim());
    setAddress(url);
    setLoading(true);
    try {
      const res = await fetch(`/api/browser?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      setHtml(data.html || '<h1>No content</h1>');
    } catch {
      setHtml('<h1>Connection error</h1><p>Unable to fetch this site.</p>');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.browserShell}>
      <div className={styles.browserTopBar}>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={styles.browserInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter') loadSite(address);
          }}
        />
        <button className={styles.browserGo} onClick={() => loadSite(address)}>
          Go
        </button>
      </div>

      <div className={styles.browserLinks}>
        {QUICK_LINKS.map((link) => (
          <button key={link} className={styles.browserChip} onClick={() => loadSite(link)}>
            {link.replace('https://', '')}
          </button>
        ))}
      </div>

      <iframe
        title="Retro Browser"
        className={styles.browserIframe}
        srcDoc={html}
        sandbox="allow-forms allow-same-origin allow-scripts"
      />

      {loading && <div className={styles.browserLoading}>Dialing the cyber-web...</div>}
    </div>
  );
}
