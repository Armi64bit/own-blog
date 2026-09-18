'use client';

import { useMemo, useState } from 'react';
import styles from './styles.module.css';
import { stories } from '../data/repos';
import { isVisible } from '../data/visibility';
import AnimatedContent from './components/AnimatedContent';
import CodeLogo from './components/CodeLogo';
import LandingHeatMap from './components/LandingHeatMap';
import ParticleHeroText from './components/ParticleHeroText';

const publicStories = stories.filter((story) => isVisible(story.slug));
const filters = ['ALL', ...Array.from(new Set(publicStories.map((story) => story.language))).slice(0, 6)];

export default function LiveBlog() {
  const [filter, setFilter] = useState('ALL');
  const [query, setQuery] = useState('');
  const visible = useMemo(() => publicStories.filter((story) => (filter === 'ALL' || story.language === filter) && `${story.title} ${story.description}`.toLowerCase().includes(query.toLowerCase())), [filter, query]);
  return <main className={styles.publicShell}><LandingHeatMap /><div className={styles.landingContent}><header className={styles.publicHeader}><a href="./" className={styles.brand}><CodeLogo /> <span>OWN / BLOG</span></a><span className={styles.publicKicker}>PUBLIC JOURNAL · ARCHIVE_01</span></header><AnimatedContent className={styles.archiveHero}><div><p className={styles.eyebrow}>// PERSONAL PROJECT ARCHIVE</p><ParticleHeroText /><p className={styles.subhead}>A living record of what I’m building, learning, and making — one repository at a time.</p></div><div className={styles.heroOrb}><span>28</span><small>PROJECTS<br/>INDEXED</small></div></AnimatedContent><section className={styles.archiveBar}><div className={styles.filterRow}>{filters.map((item) => <button key={item} className={filter === item ? styles.filterActive : ''} onClick={() => setFilter(item)}>{item}</button>)}</div><label className={styles.searchBox}><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search archive..." /></label></section><section className={styles.archiveStats}><span><b>{visible.length.toString().padStart(2, '0')}</b> visible results</span><span><b>06</b> live deployments</span><span><b>∞</b> next iterations</span></section><section className={styles.publicGrid}>{visible.map((post, index) => <AnimatedContent key={post.slug} delay={(index % 4) * .06}><article className={styles.publicCard}><div className={styles.publicMeta}><span>#{String(index + 1).padStart(2, '0')} · {post.language}</span><time>★ {post.stars}</time></div><h2>{post.title}</h2><p>{post.description}</p><a href={`./${post.slug}/`}>Read story <span>↗</span></a></article></AnimatedContent>)}</section><footer className={styles.publicFooter}>Own Blog · project archive · <span>status: collecting signals</span></footer></div></main>;
}
