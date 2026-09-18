import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Github, FileText, Plus, RefreshCw, Sparkles } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

type Post = { id: number; title: string; excerpt: string; source: "github" | "manual"; hidden: boolean; status: "draft" | "published"; language?: string; stars?: number };
const seed: Post[] = [
  { id: 2, title: "own-blog", excerpt: "Personal blog with Next.js frontend and FastAPI automation backend", source: "github", hidden: false, status: "published", language: "TypeScript", stars: 0 },
  { id: 3, title: "Armi64bit", excerpt: "A GitHub project from the repository collection.", source: "github", hidden: false, status: "published", stars: 1 },
  { id: 4, title: "cat-scroll", excerpt: "A GitHub project from the repository collection.", source: "github", hidden: false, status: "published", language: "TypeScript", stars: 0 },
  { id: 5, title: "immoOVH", excerpt: "A GitHub project from the repository collection.", source: "github", hidden: false, status: "published", language: "TypeScript", stars: 0 },
  { id: 6, title: "AITrade", excerpt: "A GitHub project from the repository collection.", source: "github", hidden: false, status: "published", language: "TypeScript", stars: 0 },
  { id: 7, title: "immo", excerpt: "A GitHub project from the repository collection.", source: "github", hidden: false, status: "published", language: "TypeScript", stars: 0 },
  { id: 8, title: "cvoptimizer", excerpt: "A GitHub project from the repository collection.", source: "github", hidden: false, status: "published", language: "TypeScript", stars: 0 },
  { id: 9, title: "lolz", excerpt: "A GitHub project from the repository collection.", source: "github", hidden: false, status: "published", language: "HTML", stars: 0 },
  { id: 10, title: "room_reservation_system", excerpt: "A GitHub project from the repository collection.", source: "github", hidden: false, status: "published", language: "Java", stars: 0 },
  { id: 11, title: "Room_res_sys", excerpt: "A GitHub project from the repository collection.", source: "github", hidden: false, status: "published", stars: 0 },
  { id: 12, title: "Manajero-Andon-Visual-Management", excerpt: "A GitHub project from the repository collection.", source: "github", hidden: false, status: "published", language: "TypeScript", stars: 0 },
  { id: 13, title: "Tektai-Devtech-4TWIN2", excerpt: "A GitHub project from the repository collection.", source: "github", hidden: false, status: "published", language: "JavaScript", stars: 0 },
  { id: 14, title: "devops_groupe4", excerpt: "A GitHub project from the repository collection.", source: "github", hidden: false, status: "published", language: "Java", stars: 0 },
  { id: 15, title: "UniH23", excerpt: "A GitHub project from the repository collection.", source: "github", hidden: false, status: "published", language: "SCSS", stars: 0 },
  { id: 16, title: "socket", excerpt: "A GitHub project from the repository collection.", source: "github", hidden: false, status: "published", language: "JavaScript", stars: 0 },
  { id: 17, title: ".net", excerpt: "A GitHub project from the repository collection.", source: "github", hidden: false, status: "published", language: "C#", stars: 0 },
  { id: 18, title: ".net_airport", excerpt: "A GitHub project from the repository collection.", source: "github", hidden: false, status: "published", language: "C#", stars: 0 },
  { id: 19, title: "react-atlier2", excerpt: "A GitHub project from the repository collection.", source: "github", hidden: false, status: "published", language: "JavaScript", stars: 0 },
  { id: 20, title: "micros", excerpt: "A GitHub project from the repository collection.", source: "github", hidden: false, status: "published", language: "Java", stars: 0 },
  { id: 21, title: "eurekaserver", excerpt: "A GitHub project from the repository collection.", source: "github", hidden: false, status: "published", language: "Java", stars: 0 },
  { id: 22, title: "gestionSki", excerpt: "A GitHub project from the repository collection.", source: "github", hidden: false, status: "published", language: "Java", stars: 0 },
  { id: 23, title: "etudeDeCas", excerpt: "A GitHub project from the repository collection.", source: "github", hidden: false, status: "published", language: "Java", stars: 0 },
  { id: 24, title: "angular", excerpt: "A GitHub project from the repository collection.", source: "github", hidden: false, status: "published", language: "TypeScript", stars: 0 },
  { id: 25, title: "stage_react", excerpt: "react learning process", source: "github", hidden: false, status: "published", language: "TypeScript", stars: 0 },
  { id: 26, title: "Artfulio", excerpt: "pidev", source: "github", hidden: false, status: "published", language: "Java", stars: 0 },
  { id: 27, title: "Smart_Real_Estate_Agency_2A8", excerpt: "Smart_Real_Estate_Agency_2A8", source: "github", hidden: false, status: "published", stars: 0 },
  { id: 28, title: "eco-eware", excerpt: "environment web site", source: "github", hidden: false, status: "published", language: "HTML", stars: 0 },
  { id: 29, title: "leagueofeveilexes", excerpt: "game", source: "github", hidden: false, status: "published", stars: 0 },
];

export default function Home() {
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true });
  const [posts, setPosts] = useState(seed);
  const [hydrated, setHydrated] = useState(false);
  const [filter, setFilter] = useState<"all" | "visible" | "hidden">("all");
  const [preview, setPreview] = useState(false);
  const visible = useMemo(() => posts.filter((post) => filter === "all" || (filter === "hidden" ? post.hidden : !post.hidden)), [posts, filter]);
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("own-blog-dashboard-posts");
      if (saved) setPosts(JSON.parse(saved) as Post[]);
    } catch { /* keep the generated seed if storage is unavailable */ }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem("own-blog-dashboard-posts", JSON.stringify(posts)); } catch { /* storage is optional */ }
  }, [posts, hydrated]);
  const toggle = (id: number) => {
    const target = posts.find((post) => post.id === id);
    setPosts((items) => items.map((post) => post.id === id ? { ...post, hidden: !post.hidden } : post));
    if (target && !target.hidden) setFilter("visible");
  };
  const approve = (id: number) => setPosts((items) => items.map((post) => post.id === id ? { ...post, status: "published", hidden: false } : post));
  const add = () => setPosts((items) => [{ id: Date.now(), title: "Untitled note", excerpt: "A new draft ready for your voice.", source: "manual", hidden: false, status: "draft" }, ...items]);
  const sync = () => setPosts((items) => seed.map((post) => ({ ...post, hidden: items.find((item) => item.title === post.title)?.hidden ?? post.hidden })));
  const published = posts.filter((post) => post.status === "published" && !post.hidden).length;

  if (loading || !user) return <div className="grid min-h-screen place-items-center bg-[#f5f6f1] font-serif text-[#20221f]">Opening your private publishing desk…</div>;
  return <div className="min-h-screen bg-[#f5f6f1] text-[#20221f] md:flex">
    <aside className="hidden w-64 flex-col border-r border-[#dfe2d9] bg-[#f8f9f5] p-7 md:flex"><div className="mb-14 flex items-center gap-2 font-mono text-xs tracking-[.16em]"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#20221f] text-[#b9e56b]">◒</span> OWN / BLOG</div><div className="flex items-center gap-3 border-b border-[#dfe2d9] pb-8"><div className="grid h-9 w-9 place-items-center rounded-full bg-[#d4deca] font-bold">A</div><div><strong className="block text-sm">Armi</strong><span className="font-mono text-[11px] text-[#787d75]">@Armi64bit</span></div><span className="ml-auto h-2 w-2 rounded-full bg-[#80bc3c]" /></div><nav className="grid gap-2 py-7"><button onClick={() => setPreview(false)} className={`rounded-md p-3 text-left text-sm ${!preview ? "bg-[#eef0e8]" : "text-[#787d75]"}`}>✦ &nbsp; Publishing desk</button><button onClick={() => setPreview(true)} className={`rounded-md p-3 text-left text-sm ${preview ? "bg-[#eef0e8]" : "text-[#787d75]"}`}>⌂ &nbsp; Live blog <span className="float-right rounded-full bg-[#e0e4d9] px-2 text-xs">{published}</span></button><div className="p-3 text-sm text-[#787d75]">◉ &nbsp; GitHub sync <span className="float-right font-mono text-[10px] text-[#70a52d]">ON</span></div></nav><div className="mt-auto rounded-lg border border-[#e1e8d8] bg-[#eff3e8] p-4 text-xs"><strong>● &nbsp; Sync is healthy</strong><p className="mt-2 leading-relaxed text-[#787d75]">Repositories become drafts. You decide what becomes a story.</p></div><p className="mt-6 font-mono text-[9px] text-[#a3a69f]">v0.1 · personal edition</p></aside>
    <main className="w-full max-w-6xl p-6 sm:p-10 md:ml-0 md:p-16">{preview ? <><p className="font-mono text-[10px] tracking-[.12em] text-[#92978e]">PUBLIC PREVIEW</p><h1 className="mt-4 font-serif text-4xl tracking-tight">Stories from the workshop <span className="text-[#9ac85b]">✦</span></h1><p className="mt-3 text-sm text-[#787d75]">Only visible and approved posts appear here.</p><div className="mt-12 grid gap-4 sm:grid-cols-2">{posts.filter((post) => post.status === "published" && !post.hidden).map((post) => <article className="rounded-lg border border-[#dfe2d9] bg-white p-7" key={post.id}><span className="font-mono text-[10px] text-[#949a91]">NOTE / {post.source.toUpperCase()}</span><h2 className="mt-5 font-serif text-xl">{post.title}</h2><p className="mt-3 text-sm leading-relaxed text-[#787d75]">{post.excerpt}</p></article>)}</div></> : <><header className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="font-mono text-[10px] tracking-[.12em] text-[#92978e]">WEDNESDAY · SEPTEMBER 18, 2026</p><h1 className="mt-4 font-serif text-4xl tracking-tight">Publishing desk <span className="text-[#9ac85b]">✦</span></h1><p className="mt-3 text-sm text-[#787d75]">Your projects, translated into stories.</p></div><div className="flex gap-2"><Button variant="outline" className="border-[#dfe2d9] bg-transparent" onClick={sync}><RefreshCw className="mr-2 h-4 w-4" /> Sync now</Button><Button className="bg-[#20221f]" onClick={add}><Plus className="mr-2 h-4 w-4" /> New post</Button></div></header><div className="my-12 grid grid-cols-3 border-y border-[#dfe2d9]"><div className="py-5"><span className="font-mono text-[10px] text-[#949a91]">VISIBLE STORIES</span><strong className="mt-2 block font-serif text-3xl">{published.toString().padStart(2, "0")}</strong><small className="text-xs text-[#787d75]">published on your blog</small></div><div className="border-l border-[#dfe2d9] py-5 pl-5 sm:pl-9"><span className="font-mono text-[10px] text-[#949a91]">IN REVIEW</span><strong className="mt-2 block font-serif text-3xl">{posts.filter((p) => p.status === "draft" && !p.hidden).length.toString().padStart(2, "0")}</strong><small className="text-xs text-[#787d75]">waiting for approval</small></div><div className="border-l border-[#dfe2d9] py-5 pl-5 sm:pl-9"><span className="font-mono text-[10px] text-[#949a91]">HIDDEN</span><strong className="mt-2 block font-serif text-3xl">{posts.filter((p) => p.hidden).length.toString().padStart(2, "0")}</strong><small className="text-xs text-[#787d75]">private by your choice</small></div></div><div className="mb-4 flex items-center justify-between"><div className="flex gap-5">{(["all", "visible", "hidden"] as const).map((key) => <button key={key} onClick={() => setFilter(key)} className={`border-b-2 py-2 text-xs font-medium capitalize ${filter === key ? "border-[#b9e56b] text-[#20221f]" : "border-transparent text-[#969b93]"}`}>{key} <span className="font-mono text-[10px]">{key === "all" ? posts.length : posts.filter((p) => key === "hidden" ? p.hidden : !p.hidden).length}</span></button>)}</div><span className="font-mono text-[10px] text-[#949a91]">LATEST FIRST⌄</span></div><div className="grid gap-3">{visible.map((post) => <article className={`rounded-lg border border-[#dfe2d9] bg-white p-5 ${post.hidden ? "opacity-60" : ""}`} key={post.id}><div className="flex gap-4"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#eef5df] text-[#7caa43]">{post.source === "github" ? <Github size={17} /> : <FileText size={17} />}</div><div className="min-w-0 flex-1"><div className="flex gap-3 font-mono text-[10px] text-[#949a91]"><span>{post.source === "github" ? "GITHUB REPOSITORY" : "MANUAL DRAFT"}</span><span>· JUST NOW</span></div><h2 className="mt-2 font-serif text-lg">{post.title}</h2><p className="mt-1 text-xs leading-relaxed text-[#787d75]">{post.excerpt}</p><div className="mt-3 flex gap-2">{post.language && <Badge variant="secondary" className="bg-[#f1f3ed] font-mono text-[9px]">{post.language}</Badge>}{post.source === "github" && <Badge variant="secondary" className="bg-[#f1f3ed] font-mono text-[9px]">★ {post.stars}</Badge>}<Badge variant="secondary" className={post.hidden ? "bg-[#f1f3ed] text-[#71786b]" : post.status === "published" ? "bg-[#e8f4d9] text-[#5d8d2c]" : "bg-[#fbf0da] text-[#b17e36]"}>{post.hidden ? "HIDDEN" : post.status === "published" ? "LIVE" : "REVIEW"}</Badge></div></div><div className="flex items-start gap-2">{post.status === "draft" && !post.hidden && <Button size="sm" variant="outline" className="border-[#bddb8c] bg-[#f1f9e8] text-[#588727]" onClick={() => approve(post.id)}>Approve ↗</Button>}<Button size="icon" variant="ghost" onClick={() => toggle(post.id)} title={post.hidden ? "Show on blog" : "Hide from blog"}>{post.hidden ? <Eye size={16} /> : <EyeOff size={16} />}</Button></div></div></article>)}</div></>}</main>
  </div>;
}
