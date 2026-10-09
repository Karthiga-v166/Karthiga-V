import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { ConfettiCelebration } from '../utils/confetti';

export interface CelebrationCanvasHandle {
  burst: (originX?: number, originY?: number) => void;
  celebrate: () => void;
  clear: () => void;
}

interface CelebrationCanvasProps {
  isActive: boolean;
}

export const CelebrationCanvas = forwardRef<CelebrationCanvasHandle, CelebrationCanvasProps>(
  ({ isActive }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const engineRef = useRef<ConfettiCelebration | null>(null);

    useEffect(() => {
      if (!canvasRef.current) return;

      const engine = new ConfettiCelebration(canvasRef.current);
      engineRef.current = engine;

      const handleResize = () => {
        if (canvasRef.current && engineRef.current) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          canvasRef.current.width = window.innerWidth * dpr;
          canvasRef.current.height = window.innerHeight * dpr;
          const ctx = canvasRef.current.getContext('2d');
          ctx?.scale(dpr, dpr);
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        engine.destroy();
        engineRef.current = null;
      };
    }, []);

    // Trigger celebration when isActive becomes true
    useEffect(() => {
      if (isActive && engineRef.current) {
        // Find Square 100 on screen if possible
        const sq100El = document.querySelector('[data-square="100"]');
        let squarePos: { x: number; y: number } | undefined;
        if (sq100El) {
          const rect = sq100El.getBoundingClientRect();
          squarePos = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          };
        }
        engineRef.current.launchVictorySequence(squarePos);
      } else if (!isActive && engineRef.current) {
        engineRef.current.clear();
      }
    }, [isActive]);

    useImperativeHandle(ref, () => ({
      burst: (originX, originY) => {
        const x = originX ?? window.innerWidth / 2;
        const y = originY ?? window.innerHeight / 2;
        engineRef.current?.addBurst(x, y, 70);
      },
      celebrate: () => {
        engineRef.current?.launchVictorySequence();
      },
      clear: () => {
        engineRef.current?.clear();
      },
    }));

    return (
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-50 overflow-hidden"
        style={{ pointerEvents: 'none' }}
      />
    );
  }
);

CelebrationCanvas.displayName = 'CelebrationCanvas';
