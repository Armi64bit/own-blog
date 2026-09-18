'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from '../styles.module.css';

export default function PageParallax({ slug, language }: { slug: string; language: string }) {
  const [scroll, setScroll] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const variant = useMemo(() => [...slug].reduce((total, char) => total + char.charCodeAt(0), 0) % 4, [slug]);
  useEffect(() => { const onScroll = () => setScroll(window.scrollY); const onPointer = (event: PointerEvent) => setPointer({ x: (event.clientX / window.innerWidth - .5) * 2, y: (event.clientY / window.innerHeight - .5) * 2 }); window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('pointermove', onPointer, { passive: true }); return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('pointermove', onPointer); }; }, []);
  return <div className={`${styles.pageParallax} ${styles[`pageParallax${variant}`]}`} aria-hidden="true"><div className={styles.pageGrid} style={{ transform: `translate3d(${pointer.x * -10}px, ${scroll * -.08 + pointer.y * -8}px, 0)` }} /><div className={styles.pageCodeSlow} style={{ transform: `translate3d(${pointer.x * 18}px, ${scroll * -.18 + pointer.y * 12}px, 0)` }}>{`// ${slug}\nconst page = await build('${language}');\nreturn page.interactive();`}</div><div className={styles.pageCodeFast} style={{ transform: `translate3d(${pointer.x * -24}px, ${scroll * -.32 + pointer.y * -16}px, 0)` }}>{`{ 0x7f } 0101 1010\n> scroll.signal / active\n> render.layer(${variant})`}</div><div className={styles.pageOrb} style={{ transform: `translate3d(${pointer.x * 26}px, ${scroll * -.12 + pointer.y * 18}px, 0)` }} /></div>;
}
