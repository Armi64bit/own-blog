import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'own-blog';
const isPages = process.env.GITHUB_ACTIONS === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isPages ? `/${repo}` : '',
  assetPrefix: isPages ? `/${repo}/` : '',
  outputFileTracingRoot: root,
  turbopack: { root },
};
export default nextConfig;
