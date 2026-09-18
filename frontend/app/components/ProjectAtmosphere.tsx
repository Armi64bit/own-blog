'use client';

import { useEffect, useState } from 'react';
import styles from '../styles.module.css';

type Props = { title: string; language: string; stars: number; repo: string; slug: string };

export default function ProjectAtmosphere({ title, language, stars, repo, slug }: Props) {
  const [offset, setOffset] = useState(0);
  const [panel, setPanel] = useState<'overview' | 'signals' | 'stack'>('overview');
  useEffect(() => { const onScroll = () => setOffset(window.scrollY); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll); }, []);
  const signal = panel === 'overview' ? 'tracking the build' : panel === 'signals' ? `${stars} public stars · archive signal` : `${language} · source layer`;
  return <div className={styles.projectAtmosphere}><div className={`${styles.parallaxCode} ${styles.parallaxFar}`} style={{ transform: `translate3d(0, ${offset * .12}px, 0)` }}>{`// ${slug}\nconst signal = await observe();\nif (signal.ready) ship(signal);`}</div><div className={`${styles.parallaxCode} ${styles.parallaxNear}`} style={{ transform: `translate3d(0, ${offset * -.08}px, 0)` }}>{`0101 0010  ${language.toUpperCase()}  1010\n> booting project atmosphere...`}</div><div className={styles.projectSignal}><span className={styles.signalDot}/> {signal}</div><div className={styles.projectIdentity}><span className={styles.projectIndex}>PROJECT / {slug.toUpperCase()}</span><strong>{title}</strong><span>{repo}</span></div><div className={styles.projectTabs}>{(['overview', 'signals', 'stack'] as const).map((item) => <button key={item} onClick={() => setPanel(item)} className={panel === item ? styles.projectTabActive : ''}>{item}</button>)}</div></div>;
}
