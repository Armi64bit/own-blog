'use client';

import { useMemo, useState } from 'react';
import styles from './styles.module.css';

type Post = { id:number; title:string; excerpt:string; source:'github'|'manual'; status:'draft'|'published'; hidden:boolean; repo_name?:string; language?:string; stars:number; repo_url?:string; };

const seed: Post[] = [
  { id:1, title:'Welcome to Own Blog', excerpt:'A calm place for projects, notes, and experiments.', source:'manual', status:'published', hidden:false, stars:0 },
  { id:2, title:'own-blog', excerpt:'Personal blog with Next.js, FastAPI, GitHub sync, and email approvals.', source:'github', status:'draft', hidden:false, repo_name:'own-blog', language:'TypeScript', stars:0, repo_url:'https://github.com/Armi64bit/own-blog' },
  { id:3, title:'Private experiments', excerpt:'A synchronized repository kept off the public blog until you are ready.', source:'github', status:'draft', hidden:true, repo_name:'private-experiments', language:'Python', stars:2 },
];

export default function Home() {
  const [posts, setPosts] = useState(seed);
  const [filter, setFilter] = useState<'all'|'visible'|'hidden'>('all');
  const [tab, setTab] = useState<'desk'|'site'>('desk');
  const visible = useMemo(() => posts.filter(p => filter === 'all' || (filter === 'hidden' ? p.hidden : !p.hidden)), [posts, filter]);
  const published = posts.filter(p => p.status === 'published' && !p.hidden);
  const toggleHidden = (id:number) => setPosts(items => items.map(p => p.id === id ? {...p, hidden: !p.hidden} : p));
  const approve = (id:number) => setPosts(items => items.map(p => p.id === id ? {...p, status:'published', hidden:false} : p));
  const addManual = () => setPosts(items => [{id:Date.now(), title:'Untitled note', excerpt:'A new draft ready for your voice.', source:'manual', status:'draft', hidden:false, stars:0}, ...items]);

  return <main className={styles.shell}>
    <aside className={styles.sidebar}>
      <div className={styles.brand}><span className={styles.mark}>◒</span><span>OWN / BLOG</span></div>
      <div className={styles.profile}><div className={styles.avatar}>A</div><div><strong>Armi</strong><span>@Armi64bit</span></div><span className={styles.dot}/></div>
      <nav><button className={tab==='desk'?styles.activeNav:''} onClick={()=>setTab('desk')}><span>✦</span> Publishing desk</button><button className={tab==='site'?styles.activeNav:''} onClick={()=>setTab('site')}><span>⌂</span> Live blog <b>{published.length}</b></button><button><span>↗</span> GitHub sync <i>ON</i></button></nav>
      <div className={styles.sideNote}><span className={styles.signal}>●</span><strong>Sync is healthy</strong><p>Repositories become drafts. You decide what becomes a story.</p></div>
      <footer><span>v0.1 · personal edition</span><span>Settings&nbsp; ↗</span></footer>
    </aside>
    <section className={styles.content}>
      {tab === 'desk' ? <>
        <header className={styles.header}><div><p className={styles.eyebrow}>WEDNESDAY · SEPTEMBER 18, 2026</p><h1>Publishing desk <span>✦</span></h1><p className={styles.subhead}>Your projects, translated into stories.</p></div><div className={styles.headerActions}><button className={styles.ghost}>↻ Sync now</button><button className={styles.primary} onClick={addManual}>＋ New post</button></div></header>
        <div className={styles.stats}><div><span>VISIBLE STORIES</span><strong>{published.length.toString().padStart(2,'0')}</strong><small>published on your blog</small></div><div><span>IN REVIEW</span><strong>{posts.filter(p=>p.status==='draft'&&!p.hidden).length.toString().padStart(2,'0')}</strong><small>waiting for your approval</small></div><div><span>HIDDEN</span><strong>{posts.filter(p=>p.hidden).length.toString().padStart(2,'0')}</strong><small>private by your choice</small></div></div>
        <div className={styles.toolbar}><div className={styles.tabs}><button className={filter==='all'?styles.selected:''} onClick={()=>setFilter('all')}>All posts <b>{posts.length}</b></button><button className={filter==='visible'?styles.selected:''} onClick={()=>setFilter('visible')}>Visible <b>{posts.filter(p=>!p.hidden).length}</b></button><button className={filter==='hidden'?styles.selected:''} onClick={()=>setFilter('hidden')}>Hidden <b>{posts.filter(p=>p.hidden).length}</b></button></div><button className={styles.filter}>Latest first⌄</button></div>
        <div className={styles.list}>{visible.map((post, index) => <article className={`${styles.card} ${post.hidden?styles.hiddenCard:''}`} key={post.id}><div className={styles.cardTop}><span className={post.source==='github'?styles.githubIcon:styles.noteIcon}>{post.source==='github'?'◉':'✎'}</span><div className={styles.cardMain}><div className={styles.cardMeta}><span>{post.source==='github'?'GITHUB REPOSITORY':'MANUAL DRAFT'}</span><time>{index===0?'JUST NOW':index===1?'2 HOURS AGO':'YESTERDAY'}</time></div><h2>{post.title}</h2><p>{post.excerpt}</p><div className={styles.tags}>{post.language&&<span>{post.language}</span>}{post.source==='github'&&<span>★ {post.stars}</span>}<span className={post.status==='published'&&!post.hidden?styles.live:styles.review}>{post.hidden?'HIDDEN':post.status==='published'?'LIVE':'REVIEW'}</span></div></div><div className={styles.cardActions}><button title={post.hidden?'Show on blog':'Hide from blog'} onClick={()=>toggleHidden(post.id)}>{post.hidden?'◉':'◌'}</button>{post.status==='draft'&&!post.hidden&&<button className={styles.approve} onClick={()=>approve(post.id)}>Approve ↗</button>}<button>···</button></div></div></article>)}</div>
      </> : <div className={styles.livePage}><p className={styles.eyebrow}>PUBLIC PREVIEW</p><h1>Stories from the workshop <span>✦</span></h1><p className={styles.subhead}>Only visible and approved posts appear here.</p><div className={styles.publicGrid}>{published.map(p=><article className={styles.publicCard} key={p.id}><span>NOTE / {p.source.toUpperCase()}</span><h2>{p.title}</h2><p>{p.excerpt}</p><a href={p.repo_url||'#'}>Read story ↗</a></article>)}</div></div>}
    </section>
  </main>;
}
