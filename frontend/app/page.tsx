'use client';

import styles from './styles.module.css';
import { stories } from '../data/repos';
import AnimatedContent from './components/AnimatedContent';

export default function LiveBlog() {
  return <main className={styles.publicShell}><header className={styles.publicHeader}><a href="./" className={styles.brand}><span className={styles.mark}>◒</span> OWN / BLOG</a><span className={styles.publicKicker}>PUBLIC JOURNAL · {stories.length} PROJECTS</span></header><AnimatedContent className={styles.publicHero}><p className={styles.eyebrow}>PROJECTS, NOTES, AND EXPERIMENTS</p><h1>Stories from the workshop <span>✦</span></h1><p className={styles.subhead}>A living record of what I’m building, learning, and making.</p></AnimatedContent><section className={styles.publicGrid}>{stories.map((post, index) => <AnimatedContent key={post.slug} delay={(index % 4) * .07}><article className={styles.publicCard}><div className={styles.publicMeta}><span>GITHUB PROJECT</span><time>★ {post.stars}</time></div><h2>{post.title}</h2><p>{post.description}</p><a href={`./${post.slug}/`}>Read story ↗</a></article></AnimatedContent>)}</section><footer className={styles.publicFooter}>Own Blog · public view</footer></main>;
}
