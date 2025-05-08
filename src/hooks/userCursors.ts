import { useEffect, useRef, useState } from 'react';

interface CursorData {
  id: string;
  x: number;
  y: number;
}

export const useCursors = (userId: string) => {
  const socket = useRef<WebSocket | null>(null);
  const [cursors, setCursors] = useState<Record<string, CursorData>>({});

  useEffect(() => {
    const ws = new WebSocket('wss://outerwilds.fr/ws/');
    socket.current = ws;

    const handleMouseMove = (e: MouseEvent) => {
      const data = { id: userId, x: e.clientX, y: e.clientY };
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      }
    };

    ws.onmessage = (event) => {
      const data: CursorData = JSON.parse(event.data);
      if (data.id !== userId) {
        setCursors(prev => ({ ...prev, [data.id]: data }));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      ws.close();
    };
  }, [userId]);

  return cursors;
};
