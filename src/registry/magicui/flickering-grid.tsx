'use client';

import { useEffect, useRef } from 'react';

interface FlickeringGridProps {
  className?: string;
  squareSize?: number;
  gridGap?: number;
  color?: string;
  maxOpacity?: number;
  flickerChance?: number;
  height?: number;
  width?: number;
  refreshRate?: number;
}

export function FlickeringGrid({
  className = '',
  squareSize = 4,
  gridGap = 6,
  color = '#60A5FA',
  maxOpacity = 0.5,
  flickerChance = 0.1,
  height = 800,
  width = 800,
  refreshRate = 1000,
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cols = Math.floor(width / (squareSize + gridGap));
    const rows = Math.floor(height / (squareSize + gridGap));
    const totalSquares = cols * rows;
    const squares = Array(totalSquares).fill(0);

    const drawSquare = (x: number, y: number, opacity: number) => {
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.fillRect(
        x * (squareSize + gridGap),
        y * (squareSize + gridGap),
        squareSize,
        squareSize
      );
    };

    const animate = (timestamp: number) => {
      if (timestamp - lastUpdateRef.current >= refreshRate) {
        ctx.clearRect(0, 0, width, height);

        squares.forEach((_, i) => {
          const x = i % cols;
          const y = Math.floor(i / cols);
          const shouldFlicker = Math.random() < flickerChance;
          const opacity = shouldFlicker ? Math.random() * maxOpacity : 0;
          drawSquare(x, y, opacity);
        });

        lastUpdateRef.current = timestamp;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [squareSize, gridGap, color, maxOpacity, flickerChance, height, width, refreshRate]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      height={height}
      width={width}
      className={className}
    />
  );
}