import json
import re
from pathlib import Path

home = Path('/home/ubuntu/own-blog/client/src/pages/Home.tsx')
repos = [r for r in json.loads(Path('/tmp/armi-repos.json').read_text()) if not r.get('fork')]

def js(value):
    return json.dumps(value, ensure_ascii=False)

items = [{
    'id': index + 2,
    'title': repo['name'],
    'excerpt': repo.get('description') or 'A GitHub project from the repository collection.',
    'source': 'github',
    'hidden': False,
    'status': 'published',
    'language': repo.get('language'),
    'stars': repo.get('stargazers_count', 0),
} for index, repo in enumerate(repos)]
items.insert(0, {'id': 1, 'title': 'Welcome to Own Blog', 'excerpt': 'A calm place for projects, notes, and experiments.', 'source': 'manual', 'hidden': False, 'status': 'published'})

def render(item):
    fields = [f"id: {item['id']}", f"title: {js(item['title'])}", f"excerpt: {js(item['excerpt'])}", f"source: \"{item['source']}\"", f"hidden: {str(item['hidden']).lower()}", f"status: \"{item['status']}\""]
    if item.get('language'):
        fields.append(f"language: {js(item['language'])}")
    if item.get('stars') is not None and item['source'] == 'github':
        fields.append(f"stars: {item['stars']}")
    return '  { ' + ', '.join(fields) + ' },'

new_seed = 'const seed: Post[] = [\n' + '\n'.join(render(item) for item in items) + '\n];'
text = home.read_text()
text = re.sub(r'const seed: Post\[\] = \[.*?\n\];', new_seed, text, count=1, flags=re.S)
text = text.replace('const add = () => setPosts((items) => [{ id: Date.now(), title: "Untitled note", excerpt: "A new draft ready for your voice.", source: "manual", hidden: false, status: "draft" }, ...items]);', 'const add = () => setPosts((items) => [{ id: Date.now(), title: "Untitled note", excerpt: "A new draft ready for your voice.", source: "manual", hidden: false, status: "draft" }, ...items]);')
home.write_text(text)
print(f'updated dashboard seed with {len(items)} posts')
