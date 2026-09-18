'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

type Props = { language: string; code: string; fileName?: string };
const tokenize = (code: string) => code.split(/(\/\/.*|#[^\n]*|\b(?:const|let|var|function|return|class|import|from|public|private|static|void|def|if|else|new|async|await|export)\b|\b\d+\b|["'`][^"'`]*["'`])/g).filter(Boolean);

export default function CodeSnippet({ language, code, fileName = 'src/index.ts' }: Props) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => { if (!ref.current) return; const lines = Array.from(ref.current.querySelectorAll('[data-code-line]')); gsap.fromTo(lines, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: .35, stagger: .035, ease: 'power2.out', delay: .18 }); }, []);
  const copy = async () => { await navigator.clipboard?.writeText(code); setCopied(true); window.setTimeout(() => setCopied(false), 1600); };
  return <div className="codePanel"><div className="codePanelTop"><span className="codeFileIcon">◈</span><strong>{fileName}</strong><span className="codeBranch">main</span><button onClick={copy}>{copied ? 'Copied' : 'Copy'}</button></div><div className="codePanelBar"><span className="codeDots"><i/><i/><i/></span><span>{language.toLowerCase()} · repository excerpt</span><span className="codePulse">● live</span></div><pre ref={ref}><code>{code.split('\n').map((line, index) => <span data-code-line key={`${index}-${line}`} className="codeLine"><b>{String(index + 1).padStart(2, '0')}</b><span>{tokenize(line).map((part, tokenIndex) => <em key={`${tokenIndex}-${part}`} className={part.startsWith('//') || part.startsWith('#') ? 'comment' : /^(const|let|var|function|return|class|import|from|public|private|static|void|def|if|else|new|async|await|export)$/.test(part) ? 'keyword' : /^\d+$/.test(part) ? 'number' : /^["'`]/.test(part) ? 'string' : ''}>{part}</em>)}</span></span>)}</code></pre></div>;
}
