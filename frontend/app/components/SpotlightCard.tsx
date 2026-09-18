'use client';

import { type CSSProperties, type MouseEvent, type ReactNode, useState } from 'react';
import styles from '../styles.module.css';

export default function SpotlightCard({ children }: { children: ReactNode }) {
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });

  const handleMove = (event: MouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setSpotlight({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    });
  };

  return (
    <article
      className={styles.spotlightCard}
      onMouseMove={handleMove}
      style={{ '--spotlight-x': `${spotlight.x}%`, '--spotlight-y': `${spotlight.y}%` } as CSSProperties}
    >
      <div className={styles.spotlightContent}>{children}</div>
    </article>
  );
}
