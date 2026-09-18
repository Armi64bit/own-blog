import base64
import json
import os
import re
import subprocess
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen

root = Path('/home/ubuntu/own-blog')
source = Path('/tmp/armi-repos.json')
target = root / 'frontend/data/repos.ts'
shots = root / 'frontend/public/screenshots'
shots.mkdir(parents=True, exist_ok=True)
repos = [repo for repo in json.loads(source.read_text()) if not repo.get('fork')]

def slug(name: str) -> str:
    return re.sub(r'[^a-zA-Z0-9]+', '-', name).strip('-').lower() or 'project'

def title(name: str) -> str:
    return re.sub(r'[_-]+', ' ', name).strip().title()

def quote(value: str) -> str:
    return value.replace('\\', '\\\\').replace("'", "\\'").replace('\n', ' ')

def readme(full_name: str) -> str:
    env = {**os.environ, 'GH_FORCE_TTY': '0', 'NO_COLOR': '1'}
    proc = subprocess.run(['gh', 'api', f'repos/{full_name}/readme', '--header', 'Accept: application/vnd.github+json'], capture_output=True, text=True, env=env, timeout=20)
    if proc.returncode != 0:
        return ''
    try:
        payload = json.loads(proc.stdout)
        return base64.b64decode(payload.get('content', '')).decode('utf-8', errors='ignore')
    except Exception:
        return ''

def excerpt(text: str, fallback: str) -> str:
    clean = re.sub(r'!\[[^]]*\]\([^)]*\)', '', text)
    clean = re.sub(r'[`*_>#\[\]()]', ' ', clean)
    clean = re.sub(r'\s+', ' ', clean).strip()
    if not clean:
        return fallback
    return clean[:260].rstrip() + ('…' if len(clean) > 260 else '')

def homepage_snapshot(repo: dict) -> str:
    homepage = (repo.get('homepage') or '').strip()
    if not homepage.startswith(('http://', 'https://')):
        return ''
    parsed = urlparse(homepage)
    safe = re.sub(r'[^a-z0-9]+', '-', f"{repo['name']}-{parsed.netloc}").strip('-').lower()
    output = shots / f'{safe}.png'
    try:
        Request(homepage, method='HEAD', headers={'User-Agent': 'OwnBlog/1.0'})
        subprocess.run(['/usr/bin/chromium', '--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--window-size=1440,900', f'--screenshot={output}', homepage], capture_output=True, timeout=35)
    except Exception:
        return ''
    return f'/screenshots/{output.name}' if output.exists() and output.stat().st_size > 5000 else ''

lines = ["export type RepoStory = { slug: string; title: string; repo: string; language: string; stars: number; description: string; intro: string; readme: string; homepage: string; screenshot: string; sections: { heading: string; body: string }[]; };", "", "export const stories: RepoStory[] = ["]
for repo in repos:
    name = repo['name']; display = title(name); language = repo.get('language') or 'Multi-language project'
    fallback = repo.get('description') or f'{display} is a project in the Own Blog repository collection.'
    rm = readme(repo['full_name'])
    description = excerpt(rm, fallback)
    homepage = (repo.get('homepage') or '').strip()
    screenshot = homepage_snapshot(repo) if homepage else ''
    intro = f"{display} is part of my GitHub workspace, built with {language}. {description}"
    lines += ["  {", f"    slug: '{quote(slug(name))}', title: '{quote(display)}', repo: '{quote(repo['full_name'])}', language: '{quote(language)}', stars: {int(repo.get('stargazers_count') or 0)},", f"    description: '{quote(description)}', homepage: '{quote(homepage)}', screenshot: '{quote(screenshot)}',", f"    intro: '{quote(intro)}', readme: '{quote(description)}',", "    sections: [", f"      {{ heading: 'What this project is', body: '{quote(description)}' }},", f"      {{ heading: 'The personal thread', body: '{quote('This project reflects a hands-on step in my learning and building process, with the implementation details preserved in the repository history.')}' }},", f"      {{ heading: 'Keep exploring', body: '{quote('Read the source, follow the commits, and open the live project when a hosted version is available.')}' }},", "    ],", "  },"]
lines.append("];\n")
target.write_text('\n'.join(lines))
print(f'enriched {len(repos)} repositories; screenshots={sum(1 for r in repos if (r.get("homepage") or ""))}')
