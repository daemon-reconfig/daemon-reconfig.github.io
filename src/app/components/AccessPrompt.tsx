// ─── file: src/app/components/AccessPrompt.tsx ────────────────────────────────
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  correctPassword: string;
  onClose: () => void;
}

export default function AccessPrompt({ correctPassword, onClose }: Props) {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === correctPassword) {
      router.push('/computer');
    } else {
      setError(true);
      setInput('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="text-green-400 font-mono text-lg">
        <label>
          <span>ACCESS: </span>
          <input
            autoFocus
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(false);
            }}
            className="bg-black border-b-2 border-green-400 focus:outline-none"
          />
        </label>
        {error && (
          <p className="mt-2 text-sm text-yellow-300">
            Hint: It’s on the sticky note.
          </p>
        )}
      </form>
    </div>
  );
}
