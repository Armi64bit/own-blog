'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from '../styles.module.css';

type Props = { title: string; language: string; stars: number; repo: string; slug: string };

export default function ProjectAtmosphere({ title, language, stars, repo, slug }: Props) {
  const [offset, setOffset] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [panel, setPanel] = useState<'overview' | 'signals' | 'stack'>('overview');
  const variant = useMemo(() => {
    let hash = 0;
    for (let index = 0; index < slug.length; index += 1) hash = (hash * 31 + slug.charCodeAt(index)) % 4;
    return hash;
  }, [slug]);
  useEffect(() => { const onScroll = () => setOffset(window.scrollY); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll); }, []);
  const signal = panel === 'overview' ? 'tracking the build' : panel === 'signals' ? `${stars} public stars · archive signal` : `${language} · source layer`;
  const move = (depth: number) => ({ transform: `translate3d(${pointer.x * depth}px, ${offset * depth + pointer.y * depth}px, 0)` });
  return <div className={`${styles.projectAtmosphere} ${styles[`atmosphere${variant}`]}`} onMouseMove={(event) => { const box = event.currentTarget.getBoundingClientRect(); setPointer({ x: (event.clientX - box.left - box.width / 2) / 24, y: (event.clientY - box.top - box.height / 2) / 24 }); }} onMouseLeave={() => setPointer({ x: 0, y: 0 })}>
    <div className={styles.atmosphereGlow} style={move(-.12)} />
    <div className={`${styles.parallaxCode} ${styles.parallaxFar}`} style={move(.12)}>{`// ${slug}\nconst signal = await observe();\nif (signal.ready) ship(signal);`}</div>
    <div className={`${styles.parallaxCode} ${styles.parallaxNear}`} style={move(-.08)}>{`0101 0010  ${language.toUpperCase()}  1010\n> booting project atmosphere...`}</div>
    {variant === 0 && <div className={styles.matrixRain} aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} style={{ animationDelay: `${index * -.33}s` }}>0101<br />&gt;_&nbsp;{index + 1}<br />1010</i>)}</div>}
    {variant === 1 && <div className={styles.orbitSystem} aria-hidden="true"><i /><i /><i /></div>}
    {variant === 2 && <div className={styles.terminalLines} aria-hidden="true"><span>GET /{slug}</span><span>200 OK · BUILD READY</span><span>render --interactive --live</span></div>}
    {variant === 3 && <div className={styles.signalBars} aria-hidden="true">{Array.from({ length: 22 }, (_, index) => <i key={index} style={{ height: `${18 + ((index * 17) % 63)}%`, animationDelay: `${index * -.08}s` }} />)}</div>}
    <div className={styles.projectSignal}><span className={styles.signalDot}/> {signal}</div><div className={styles.projectIdentity}><span className={styles.projectIndex}>PROJECT / {slug.toUpperCase()}</span><strong>{title}</strong><span>{repo}</span></div><div className={styles.projectTabs}>{(['overview', 'signals', 'stack'] as const).map((item) => <button key={item} onClick={() => setPanel(item)} className={panel === item ? styles.projectTabActive : ''}>{item}</button>)}</div>
  </div>;
}
