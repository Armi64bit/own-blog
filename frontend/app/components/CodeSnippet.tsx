'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

type Props = { language: string; code: string };

const tokenize = (code: string) => code.split(/(\/\/.*|#[^\n]*|\b(?:const|let|var|function|return|class|import|from|public|private|static|void|def|if|else|new|async|await|export)\b|\b\d+\b|["'`][^"'`]*["'`])/g).filter(Boolean);

export default function CodeSnippet({ language, code }: Props) {
  const ref = useRef<HTMLPreElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const lines = Array.from(ref.current.querySelectorAll('[data-code-line]'));
    gsap.fromTo(lines, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: .35, stagger: .035, ease: 'power2.out', delay: .18, scrollTrigger: undefined });
  }, []);
  return <div className="codePanel"><div className="codePanelBar"><span className="codeDots"><i/><i/><i/></span><span>{language.toLowerCase()} · repository excerpt</span><span className="codePulse">● live</span></div><pre ref={ref}><code>{code.split('\n').map((line, index) => <span data-code-line key={`${index}-${line}`} className="codeLine"><b>{String(index + 1).padStart(2, '0')}</b><span>{tokenize(line).map((part, tokenIndex) => <em key={`${tokenIndex}-${part}`} className={part.startsWith('//') || part.startsWith('#') ? 'comment' : /^(const|let|var|function|return|class|import|from|public|private|static|void|def|if|else|new|async|await|export)$/.test(part) ? 'keyword' : /^\d+$/.test(part) ? 'number' : /^["'`]/.test(part) ? 'string' : ''}>{part}</em>)}</span></span>)}</code></pre></div>;
}
