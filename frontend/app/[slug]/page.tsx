import { notFound } from 'next/navigation';
import styles from '../styles.module.css';

type RepoStory = { title: string; repo: string; language: string; description: string; intro: string; sections: { heading: string; body: string }[] };

const stories: Record<string, RepoStory> = {
  'own-blog': {
    title: 'Own Blog', repo: 'Armi64bit/own-blog', language: 'TypeScript · Python',
    description: 'A personal publishing desk that turns GitHub projects into thoughtful, approval-first stories.',
    intro: 'Own Blog is the system behind this journal. It keeps the public site quiet and intentional while giving me a private workspace to review, hide, edit, and publish project stories.',
    sections: [
      { heading: 'Why it exists', body: 'A GitHub profile is a useful archive, but it does not explain the thinking behind each repository. Own Blog creates a slower, more human layer: every project can become a draft, and every draft waits for a deliberate approval.' },
      { heading: 'How it works', body: 'The Next.js site is exported to GitHub Pages as a fast public journal. A FastAPI service handles post CRUD, repository synchronization, signed GitHub webhooks, and the approval workflow. Hidden repositories stay synchronized without appearing publicly.' },
      { heading: 'What comes next', body: 'The next iteration will connect the public articles directly to the backend, send email notifications when repositories change, and generate a richer project summary from each repository’s README, language, and recent activity.' },
    ],
  },
};

export function generateStaticParams() { return Object.keys(stories).map((slug) => ({ slug })); }

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = stories[slug];
  if (!story) notFound();
  return <main className={styles.publicShell}><header className={styles.publicHeader}><a href="../" className={styles.brand}><span className={styles.mark}>◒</span> OWN / BLOG</a><a href="../" className={styles.backLink}>← Back to stories</a></header><article className={styles.article}><p className={styles.eyebrow}>GITHUB PROJECT · {story.language.toUpperCase()}</p><h1>{story.title} <span>✦</span></h1><p className={styles.articleRepo}>{story.repo}</p><p className={styles.articleLead}>{story.description}</p><div className={styles.articleBody}><p>{story.intro}</p>{story.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}</div><a className={styles.repoLink} href={`https://github.com/${story.repo}`} target="_blank" rel="noreferrer">View repository on GitHub ↗</a></article><footer className={styles.publicFooter}>Own Blog · project story</footer></main>;
}
