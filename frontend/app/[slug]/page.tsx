import { notFound } from 'next/navigation';
import styles from '../styles.module.css';
import { stories } from '../../data/repos';
import AnimatedContent from '../components/AnimatedContent';

export function generateStaticParams() { return stories.map((story) => ({ slug: story.slug })); }

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = stories.find((item) => item.slug === slug);
  if (!story) notFound();
  return <main className={styles.publicShell}><header className={styles.publicHeader}><a href="../" className={styles.brand}><span className={styles.mark}>◒</span> OWN / BLOG</a><a href="../" className={styles.backLink}>← Back to stories</a></header><article className={styles.article}><AnimatedContent><p className={styles.eyebrow}>GITHUB PROJECT · {story.language.toUpperCase()} · ★ {story.stars}</p><h1>{story.title} <span>✦</span></h1><p className={styles.articleRepo}>{story.repo}</p><p className={styles.articleLead}>{story.description}</p></AnimatedContent>{story.screenshot && <AnimatedContent delay={.12}><figure className={styles.articleShot}><img src={`../${story.screenshot.slice(1)}`} alt={`Screenshot of the hosted ${story.title} project`} /><figcaption>Live view of {story.title}</figcaption></figure></AnimatedContent>}{story.homepage && <a className={styles.liveLink} href={story.homepage} target="_blank" rel="noreferrer">Open the live project ↗</a>}<div className={styles.articleBody}><AnimatedContent><p>{story.intro}</p></AnimatedContent>{story.sections.map((section, index) => <AnimatedContent key={section.heading} delay={index * .08}><section><h2>{section.heading}</h2><p>{section.body}</p></section></AnimatedContent>)}</div><a className={styles.repoLink} href={`https://github.com/${story.repo}`} target="_blank" rel="noreferrer">View repository on GitHub ↗</a></article><footer className={styles.publicFooter}>Own Blog · project story</footer></main>;
}
