import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'Own Blog', description: 'Projects, notes, and experiments by Armi.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
