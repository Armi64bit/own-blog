'use client';

import { useEffect, useState } from 'react';

type Props = { title: string; language: string; stars: number; repo: string; slug: string };

export default function ProjectAtmosphere({ title, language, stars, repo, slug }: Props) {
  const [offset, setOffset] = useState(0);
  const [panel, setPanel] = useState<'overview' | 'signals' | 'stack'>('overview');
  useEffect(() => { const onScroll = () => setOffset(window.scrollY); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll); }, []);
  const signal = panel === 'overview' ? 'tracking the build' : panel === 'signals' ? `${stars} public stars · archive signal` : `${language} · source layer`;
  return <div className="projectAtmosphere"><div className="parallaxCode parallaxFar" style={{ transform: `translate3d(0, ${offset * .12}px, 0)` }}>{`// ${slug}\nconst signal = await observe();\nif (signal.ready) ship(signal);`}</div><div className="parallaxCode parallaxNear" style={{ transform: `translate3d(0, ${offset * -.08}px, 0)` }}>{`0101 0010  ${language.toUpperCase()}  1010\n> booting project atmosphere...`}</div><div className="projectSignal"><span className="signalDot"/> {signal}</div><div className="projectIdentity"><span className="projectIndex">PROJECT / {slug.toUpperCase()}</span><strong>{title}</strong><span>{repo}</span></div><div className="projectTabs">{(['overview', 'signals', 'stack'] as const).map((item) => <button key={item} onClick={() => setPanel(item)} className={panel === item ? 'projectTabActive' : ''}>{item}</button>)}</div></div>;
}
