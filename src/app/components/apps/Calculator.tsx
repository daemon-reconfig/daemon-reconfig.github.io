'use client';

import React, { useState } from 'react';
import styles from '../LinuxDesktop.module.css';

export default function CalculatorApp() {
  const [expression, setExpression] = useState('');

  const solve = () => {
    try {
      const result = Function(`"use strict"; return (${expression || 0})`)();
      setExpression(String(result));
    } catch {
      setExpression('ERR');
    }
  };

  return (
    <div className={styles.calcRoot}>
      <input
        className={styles.calcInput}
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
        placeholder="12*7+1"
      />
      <div className={styles.calcButtons}>
        <button onClick={solve}>=</button>
        <button onClick={() => setExpression('')}>C</button>
      </div>
    </div>
  );
}
