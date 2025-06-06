// src/app/components/AccessPrompt.tsx
'use client';

import { useEffect, useState } from 'react';

interface Props {
  correctPassword: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AccessPrompt({ correctPassword, onClose, onSuccess }: Props) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  // On mount: exit pointer lock so the cursor is visible automatically.
  useEffect(() => {
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }

    // Also handle ESC to close the prompt:
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === correctPassword) {
      onSuccess();
    } else {
      setError(true);
      setInput('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="text-white font-mono text-lg">
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
