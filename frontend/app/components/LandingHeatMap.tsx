'use client';

import { useEffect, useRef } from 'react';
import styles from '../styles.module.css';

type Point = { x: number; y: number; life: number };

export default function LandingHeatMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let pointer = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };
    const trail: Point[] = [];

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const move = (event: PointerEvent) => {
      pointer.targetX = event.clientX;
      pointer.targetY = event.clientY;
      pointer.active = true;
    };

    const leave = () => {
      pointer.active = false;
    };

    const draw = () => {
      pointer.x += (pointer.targetX - pointer.x) * 0.16;
      pointer.y += (pointer.targetY - pointer.y) * 0.16;
      context.clearRect(0, 0, width, height);

      if (pointer.active) {
        trail.push({ x: pointer.x, y: pointer.y, life: 1 });
      }

      for (let index = trail.length - 1; index >= 0; index -= 1) {
        const point = trail[index];
        point.life -= 0.035;
        if (point.life <= 0) trail.splice(index, 1);
      }

      context.globalCompositeOperation = 'lighter';
      for (let index = trail.length - 1; index >= 0; index -= 1) {
        const point = trail[index];
        const size = 28 + point.life * 64;
        const glow = context.createRadialGradient(point.x, point.y, 0, point.x, point.y, size);
        glow.addColorStop(0, `rgba(255, 240, 242, ${point.life * 0.46})`);
        glow.addColorStop(0.12, `rgba(255, 116, 137, ${point.life * 0.34})`);
        glow.addColorStop(0.42, `rgba(246, 28, 65, ${point.life * 0.18})`);
        glow.addColorStop(1, 'rgba(94, 6, 25, 0)');
        context.fillStyle = glow;
        context.fillRect(point.x - size, point.y - size, size * 2, size * 2);
      }

      if (pointer.active) {
        const core = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 34);
        core.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        core.addColorStop(0.08, 'rgba(255, 181, 193, 0.72)');
        core.addColorStop(0.28, 'rgba(255, 32, 66, 0.3)');
        core.addColorStop(1, 'rgba(255, 32, 66, 0)');
        context.fillStyle = core;
        context.fillRect(pointer.x - 34, pointer.y - 34, 68, 68);
      }

      context.globalCompositeOperation = 'source-over';
      frame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerout', leave, { passive: true });
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerout', leave);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={styles.landingHeatMap} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.glowCursorCanvas} />
    </div>
  );
}
