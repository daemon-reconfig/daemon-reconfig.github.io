// src/app/components/useKeyboardControls.ts
import { useEffect, useState } from 'react';

const useKeyboard = () => {
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
          setKeys((k) => ({ ...k, forward: true }));
          break;
        case 'KeyS':
          setKeys((k) => ({ ...k, backward: true }));
          break;
        case 'KeyA':
          setKeys((k) => ({ ...k, left: true }));
          break;
        case 'KeyD':
          setKeys((k) => ({ ...k, right: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
          setKeys((k) => ({ ...k, forward: false }));
          break;
        case 'KeyS':
          setKeys((k) => ({ ...k, backward: false }));
          break;
        case 'KeyA':
          setKeys((k) => ({ ...k, left: false }));
          break;
        case 'KeyD':
          setKeys((k) => ({ ...k, right: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
};

export default useKeyboard;
