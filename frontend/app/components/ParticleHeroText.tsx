'use client';

import { useEffect, useRef } from 'react';
import styles from '../styles.module.css';

type Particle = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
};

const LINES = ['Code, experiments', '& unfinished ideas.'];

export default function ParticleHeroText() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let hovered = false;

    const buildParticles = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const bounds = wrapper.getBoundingClientRect();
      width = Math.max(320, Math.round(bounds.width));
      height = Math.max(110, Math.round(bounds.height));
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const sample = document.createElement('canvas');
      sample.width = width;
      sample.height = height;
      const sampleContext = sample.getContext('2d');
      if (!sampleContext) return;
      const fontSize = Math.min(58, Math.max(34, width * 0.055));
      sampleContext.font = `400 ${fontSize}px 'Libre Baskerville', Georgia, serif`;
      sampleContext.textBaseline = 'top';
      sampleContext.fillStyle = '#fff';
      const lineHeight = fontSize * 1.08;
      LINES.forEach((line, index) => {
        sampleContext.fillText(line, 0, index * lineHeight);
      });

      const image = sampleContext.getImageData(0, 0, width, height).data;
      const next: Particle[] = [];
      const step = width < 600 ? 4 : 5;
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const alpha = image[(y * width + x) * 4 + 3];
          if (alpha < 100) continue;
          const highlight = y > lineHeight * 0.9;
          next.push({
            x,
            y,
            targetX: x,
            targetY: y,
            vx: 0,
            vy: 0,
            color: highlight ? '#ff4053' : '#f8e9e6',
          });
        }
      }
      particles = next;
    };

    const scatter = () => {
      for (const particle of particles) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 55 + Math.random() * 125;
        particle.vx += Math.cos(angle) * distance * 0.07;
        particle.vy += Math.sin(angle) * distance * 0.07;
      }
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      for (const particle of particles) {
        const dx = particle.targetX - particle.x;
        const dy = particle.targetY - particle.y;
        particle.vx += dx * 0.018;
        particle.vy += dy * 0.018;
        particle.vx *= 0.86;
        particle.vy *= 0.86;
        particle.x += particle.vx;
        particle.y += particle.vy;
        context.fillStyle = particle.color;
        context.shadowColor = particle.color === '#ff4053' ? '#ff203b' : 'transparent';
        context.shadowBlur = particle.color === '#ff4053' ? 8 : 0;
        context.fillRect(particle.x, particle.y, 2, 2);
      }
      context.shadowBlur = 0;
      frame = window.requestAnimationFrame(draw);
    };

    const enter = () => {
      if (hovered) return;
      hovered = true;
      scatter();
    };
    const leave = () => {
      hovered = false;
    };

    buildParticles();
    const observer = new ResizeObserver(buildParticles);
    observer.observe(wrapper);
    wrapper.addEventListener('mouseenter', enter);
    wrapper.addEventListener('mouseleave', leave);
    frame = window.requestAnimationFrame(draw);

    return () => {
      observer.disconnect();
      wrapper.removeEventListener('mouseenter', enter);
      wrapper.removeEventListener('mouseleave', leave);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.particleHeroText}>
      <canvas ref={canvasRef} aria-hidden="true" />
      <h1 className={styles.particleHeroAccessible}>
        Code, experiments<br />
        <span>&amp; unfinished ideas.</span>
      </h1>
    </div>
  );
}
