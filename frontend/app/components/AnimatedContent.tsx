'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Props = { children: React.ReactNode; className?: string; delay?: number; distance?: number; direction?: 'vertical' | 'horizontal' };

export default function AnimatedContent({ children, className = '', delay = 0, distance = 48, direction = 'vertical' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const axis = direction === 'horizontal' ? 'x' : 'y';
    const ctx = gsap.context(() => {
      gsap.fromTo(node, { opacity: 0, [axis]: distance }, { opacity: 1, [axis]: 0, duration: .8, delay, ease: 'power3.out', scrollTrigger: { trigger: node, start: 'top 88%', once: true } });
    }, node);
    return () => ctx.revert();
  }, [delay, distance, direction]);
  return <div ref={ref} className={className}>{children}</div>;
}
