import json
import re
from pathlib import Path

source = Path('/tmp/armi-repos.json')
target = Path('/home/ubuntu/own-blog/frontend/data/repos.ts')
repos = [repo for repo in json.loads(source.read_text()) if not repo.get('fork')]

def slug(name: str) -> str:
    value = re.sub(r'[^a-zA-Z0-9]+', '-', name).strip('-').lower()
    return value or 'project'

def title(name: str) -> str:
    return re.sub(r'[_-]+', ' ', name).strip().title()

def quote(value: str) -> str:
    return value.replace('\\', '\\\\').replace("'", "\\'").replace('\n', ' ')

lines = ["export type RepoStory = { slug: string; title: string; repo: string; language: string; stars: number; description: string; intro: string; sections: { heading: string; body: string }[]; };", "", "export const stories: RepoStory[] = ["]
for repo in repos:
    name = repo['name']
    display = title(name)
    language = repo.get('language') or 'Multi-language project'
    description = repo.get('description') or f'{display} is a project in the Own Blog repository collection.'
    lines.append("  {")
    lines.append(f"    slug: '{quote(slug(name))}', title: '{quote(display)}', repo: '{quote(repo['full_name'])}', language: '{quote(language)}', stars: {int(repo.get('stargazers_count') or 0)},")
    lines.append(f"    description: '{quote(description)}',")
    lines.append(f"    intro: 'A closer look at {quote(display)}, what it explores, and where it fits in the wider project journey.',")
    lines.append("    sections: [")
    lines.append(f"      {{ heading: 'The project', body: '{quote(description)} The repository is part of an evolving collection of experiments, coursework, tools, and ideas.' }},")
    lines.append(f"      {{ heading: 'What stands out', body: 'Built with {quote(language)}, this project captures a specific slice of the work: a practical problem, a new framework, or a focused learning milestone.' }},")
    lines.append("      { heading: 'Explore the source', body: 'The repository is the best place to follow implementation details, commit history, and the next iteration of this project.' },")
    lines.append("    ],")
    lines.append("  },")
lines.append("];\n")
target.parent.mkdir(parents=True, exist_ok=True)
target.write_text('\n'.join(lines))
print(f'generated {len(repos)} stories at {target}')
