import {useEffect, useState} from 'react';

interface ICursorPosition {
  x: number
  y: number
}

/**
 * Hook for getting the cursor's position in realtime
 * @return {ICursorPosition}
*/
export default function useCursorPosition(): ICursorPosition {
  const [cursorPosition, setCursorPosition] = useState<ICursorPosition>({
    x: 0,
    y: 0,
  });

  const handler = (event: MouseEvent) => {
    setCursorPosition({x: event.x, y: event.y});
  };

  useEffect(() => {
    window.addEventListener('mousemove', handler);

    return () => {
      window.removeEventListener('mousemove', handler);
    };
  }, []);

  return cursorPosition;
}
