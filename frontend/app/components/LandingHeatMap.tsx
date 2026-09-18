'use client';

import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import styles from '../styles.module.css';

export default function LandingHeatMap() {
  const [point, setPoint] = useState({ x: 50, y: 36 });
  const [active, setActive] = useState(false);
  useEffect(() => { const move = (event: PointerEvent) => { setPoint({ x: (event.clientX / window.innerWidth) * 100, y: (event.clientY / window.innerHeight) * 100 }); setActive(true); }; window.addEventListener('pointermove', move, { passive: true }); return () => window.removeEventListener('pointermove', move); }, []);
  return <div className={`${styles.landingHeatMap} ${active ? styles.landingHeatMapActive : ''}`} style={{ '--heat-x': `${point.x}%`, '--heat-y': `${point.y}%` } as CSSProperties} aria-hidden="true"><div className={styles.heatGrid} /><div className={`${styles.heatPulse} ${styles.heatPulseA}`} /><div className={`${styles.heatPulse} ${styles.heatPulseB}`} /><div className={styles.heatCode}>{`0101  // hover.signal\n> archive temperature: rising\n> map.pointer(${Math.round(point.x)}, ${Math.round(point.y)})`}</div></div>;
}
