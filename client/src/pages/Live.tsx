const publishedPosts = [
  { title: "Welcome to Own Blog", excerpt: "A calm place for projects, notes, and experiments.", date: "September 18, 2026", tag: "NOTE" },
];

export default function Live() {
  return <main className="min-h-screen bg-[#f5f6f1] px-6 py-10 text-[#20221f] sm:px-12 md:px-24 md:py-16">
    <header className="mx-auto flex max-w-5xl items-center justify-between border-b border-[#dfe2d9] pb-8"><a href="/live" className="flex items-center gap-2 font-mono text-xs tracking-[.16em]"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#20221f] text-[#b9e56b]">◒</span> OWN / BLOG</a><span className="font-mono text-[10px] tracking-[.12em] text-[#92978e]">PUBLIC JOURNAL</span></header>
    <section className="mx-auto max-w-5xl py-20"><p className="font-mono text-[10px] tracking-[.12em] text-[#92978e]">PROJECTS, NOTES, AND EXPERIMENTS</p><h1 className="mt-5 max-w-2xl font-serif text-5xl leading-tight tracking-tight sm:text-6xl">Stories from the workshop <span className="text-[#9ac85b]">✦</span></h1><p className="mt-6 max-w-lg text-base leading-relaxed text-[#787d75]">A living record of what I’m building, learning, and making.</p></section>
    <section className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">{publishedPosts.map((post) => <article key={post.title} className="rounded-lg border border-[#dfe2d9] bg-white p-7 transition hover:-translate-y-0.5 hover:shadow-lg"><div className="flex items-center justify-between"><span className="font-mono text-[10px] tracking-[.12em] text-[#949a91]">{post.tag}</span><time className="font-mono text-[10px] text-[#b0b3ac]">{post.date}</time></div><h2 className="mt-8 font-serif text-2xl tracking-tight">{post.title}</h2><p className="mt-4 text-sm leading-relaxed text-[#787d75]">{post.excerpt}</p><a href="#" className="mt-8 inline-block font-mono text-[11px] text-[#658d32]">Read story ↗</a></article>)}</section>
    <footer className="mx-auto mt-24 max-w-5xl border-t border-[#dfe2d9] pt-6 font-mono text-[10px] text-[#a3a69f]">Own Blog · public view</footer>
  </main>;
}
