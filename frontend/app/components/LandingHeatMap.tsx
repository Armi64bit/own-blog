'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import styles from '../styles.module.css';

type HeatPoint = { x: number; y: number };

const INITIAL_POINT: HeatPoint = { x: 50, y: 36 };

export default function LandingHeatMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const pendingPointRef = useRef<HeatPoint>(INITIAL_POINT);
  const [point, setPoint] = useState(INITIAL_POINT);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const applyPoint = () => {
      frameRef.current = null;
      const nextPoint = pendingPointRef.current;
      map.style.setProperty('--heat-x', `${nextPoint.x}%`);
      map.style.setProperty('--heat-y', `${nextPoint.y}%`);
      setPoint(nextPoint);
    };

    const move = (event: PointerEvent) => {
      pendingPointRef.current = {
        x: Math.max(0, Math.min(100, (event.clientX / window.innerWidth) * 100)),
        y: Math.max(0, Math.min(100, (event.clientY / window.innerHeight) * 100)),
      };
      setActive(true);
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(applyPoint);
      }
    };

    window.addEventListener('pointermove', move, { passive: true });

    return () => {
      window.removeEventListener('pointermove', move);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const style = {
    '--heat-x': `${point.x}%`,
    '--heat-y': `${point.y}%`,
  } as CSSProperties;

  return (
    <div
      ref={mapRef}
      className={`${styles.landingHeatMap} ${active ? styles.landingHeatMapActive : ''}`}
      style={style}
      aria-hidden="true"
    >
      <div className={styles.heatField} />
      <div className={styles.heatGrid} />
      <div className={`${styles.heatPulse} ${styles.heatPulseA}`} />
      <div className={`${styles.heatPulse} ${styles.heatPulseB}`} />
      <div className={styles.heatCore} />
      <div className={styles.heatCode}>
        {`0101  // hover.signal
> archive temperature: rising
> map.pointer(${Math.round(point.x)}, ${Math.round(point.y)})`}
      </div>
    </div>
  );
}
