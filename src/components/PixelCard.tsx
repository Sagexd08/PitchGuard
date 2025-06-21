'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  pixelSize?: number;
  animationSpeed?: number;
  colors?: string[];
  variant?: string;
}

const PixelCard: React.FC<PixelCardProps> = ({
  children,
  className = '',
  pixelSize = 4,
  animationSpeed = 2,
  colors = ['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4'],
  variant,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const pixels: Array<{
      x: number;
      y: number;
      color: string;
      opacity: number;
      speed: number;
    }> = [];

    // Initialize pixels
    const cols = Math.floor(canvas.width / pixelSize);
    const rows = Math.floor(canvas.height / pixelSize);

    for (let i = 0; i < cols * rows * 0.1; i++) {
      pixels.push({
        x: Math.random() * cols,
        y: Math.random() * rows,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.1,
        speed: Math.random() * animationSpeed + 0.5,
      });
    }

    let animationId: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.016; // ~60fps

      pixels.forEach((pixel, index) => {
        // Update pixel position
        pixel.y -= pixel.speed * 0.1;
        if (pixel.y < 0) {
          pixel.y = rows;
          pixel.x = Math.random() * cols;
        }

        // Update opacity with sine wave
        pixel.opacity = Math.sin(time * pixel.speed + index) * 0.3 + 0.4;

        // Draw pixel
        ctx.fillStyle = pixel.color;
        ctx.globalAlpha = pixel.opacity;
        ctx.fillRect(
          pixel.x * pixelSize,
          pixel.y * pixelSize,
          pixelSize,
          pixelSize
        );
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [pixelSize, animationSpeed, colors]);

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-hidden rounded-lg ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Pixel animation canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* Glass background */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md border border-white/10" />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 pointer-events-none" />
    </motion.div>
  );
};

export default PixelCard;
