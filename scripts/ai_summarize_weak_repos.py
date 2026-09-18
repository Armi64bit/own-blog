from __future__ import annotations
import json, os, re, subprocess
from pathlib import Path
from openai import OpenAI

root = Path('/home/ubuntu/own-blog')
source = root / 'frontend/data/repos.ts'
repos = json.loads(Path('/tmp/armi-repos.json').read_text())
weak = [r for r in repos if not r.get('fork') and (not r.get('description') or r.get('description') in {'Immo is a project in the Own Blog repository collection.', 'Cvoptimizer is a project in the Own Blog repository collection.', 'Lolz is a project in the Own Blog repository collection.', 'Room Reservation System is a project in the Own Blog repository collection.', 'Room Res Sys is a project in the Own Blog repository collection.'})]
# The generated catalog is authoritative for language and current fallback prose.
text = source.read_text()
client = OpenAI()
results = {}
for repo in weak:
    name, language = repo['name'], repo.get('language') or 'multiple languages'
    prompt = f"Write a concise, personal-sounding 2-sentence blog summary for my GitHub project {name}. Language: {language}. We do not have a reliable README, so do not invent specific features. Explain the likely project intent from the name and language, clearly label uncertainty by using phrases like 'appears to be' when needed, and mention it as part of my project archive. Return only the two sentences."
    response = client.chat.completions.create(model='gpt-5-mini', messages=[{'role':'system','content':'You write accurate, restrained portfolio copy. Never invent claims.'},{'role':'user','content':prompt}], max_completion_tokens=180)
    summary = (response.choices[0].message.content or '').strip().replace('\n', ' ')
    if summary:
        results[name] = summary

for name, summary in results.items():
    escaped = summary.replace('\\', '\\\\').replace("'", "\\'")
    # Replace only the generic generated description and the matching intro/readme body.
    title = re.sub(r'[_-]+', ' ', name).strip().title()
    generic = f"{title} is a project in the Own Blog repository collection."
    text = text.replace(f"description: '{generic}'", f"description: '{escaped}'")
    text = text.replace(f"intro: '{title} is part of my GitHub workspace, built with", f"intro: '{escaped} It is part of my GitHub workspace, built with", 1)
    text = text.replace(f"readme: '{generic}'", f"readme: '{escaped}'")
    text = text.replace(f"body: '{generic}'", f"body: '{escaped}'")
source.write_text(text)
print(f'generated {len(results)} AI summaries: {", ".join(results)}')
