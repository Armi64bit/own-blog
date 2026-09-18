from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import smtplib
import sqlite3
import urllib.error
import urllib.request
from email.message import EmailMessage
from pathlib import Path
from typing import Any

from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

DB_PATH = Path(os.getenv("BLOG_DB_PATH", "blog.db"))
OWNER = os.getenv("GITHUB_OWNER", "Armi64bit")
GITHUB_REPOSITORY = os.getenv("GITHUB_REPOSITORY", f"{OWNER}/own-blog")
GITHUB_BRANCH = os.getenv("GITHUB_BRANCH", "main")
VISIBILITY_PATH = os.getenv("VISIBILITY_PATH", "frontend/data/visibility.ts")

app = FastAPI(title="Own Blog API", version="0.2.0")
app.add_middleware(CORSMiddleware, allow_origins=os.getenv("CORS_ORIGINS", "*").split(","), allow_methods=["*"], allow_headers=["*"])


def db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("""CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL, excerpt TEXT NOT NULL DEFAULT '', content TEXT NOT NULL DEFAULT '',
        repo_url TEXT UNIQUE, repo_name TEXT, language TEXT, stars INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'draft', hidden INTEGER NOT NULL DEFAULT 0,
        source TEXT NOT NULL DEFAULT 'manual', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)""")
    return conn


class PostIn(BaseModel):
    title: str = Field(min_length=1, max_length=160)
    slug: str = Field(min_length=1, max_length=160)
    excerpt: str = ""
    content: str = ""
    hidden: bool = False
    status: str = "draft"
    repo_url: str | None = None
    repo_name: str | None = None
    language: str | None = None
    stars: int = 0


class PostPatch(BaseModel):
    title: str | None = None
    slug: str | None = None
    excerpt: str | None = None
    content: str | None = None
    hidden: bool | None = None
    status: str | None = None


class VisibilityIn(BaseModel):
    slug: str = Field(min_length=1, max_length=160)
    hidden: bool


def row(item: sqlite3.Row) -> dict[str, Any]:
    result = dict(item)
    result["hidden"] = bool(result["hidden"])
    return result


def seed() -> None:
    conn = db()
    if conn.execute("SELECT COUNT(*) FROM posts").fetchone()[0] == 0:
        conn.execute("INSERT INTO posts (slug,title,excerpt,content,language,status,source) VALUES (?,?,?,?,?,?,?)", ("welcome-to-own-blog", "Welcome to Own Blog", "A calm place for projects, notes, and experiments.", "# Welcome\n\nThis is your own publishing desk.", "Markdown", "published", "manual"))
        conn.commit()
    conn.close()


seed()


def github_headers() -> dict[str, str]:
    token = os.getenv("GITHUB_TOKEN")
    if not token:
        raise HTTPException(503, "GITHUB_TOKEN is not configured on the FastAPI service")
    return {"Accept": "application/vnd.github+json", "Authorization": f"Bearer {token}", "User-Agent": "own-blog"}


def github_request(method: str, url: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
    body = json.dumps(payload).encode() if payload is not None else None
    request = urllib.request.Request(url, data=body, headers={**github_headers(), "Content-Type": "application/json"}, method=method)
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            return json.load(response)
    except urllib.error.HTTPError as exc:
        raise HTTPException(502, f"GitHub API error {exc.code}") from exc


def update_github_visibility(slug: str, hidden: bool) -> None:
    api = f"https://api.github.com/repos/{GITHUB_REPOSITORY}/contents/{VISIBILITY_PATH}"
    current = github_request("GET", f"{api}?ref={GITHUB_BRANCH}")
    decoded = base64.b64decode(current["content"]).decode()
    slugs = set()
    for item in decoded.splitlines():
        if "'" in item and item.strip().startswith("'", 0):
            slugs.add(item.strip().strip("',"))
    if hidden:
        slugs.add(slug)
    else:
        slugs.discard(slug)
    content = "export const hiddenSlugs = new Set<string>([\n" + "".join(f"  '{item}',\n" for item in sorted(slugs)) + "]);\nexport const isVisible = (slug: string) => !hiddenSlugs.has(slug);\n"
    github_request("PUT", api, {"message": f"Update visibility for {slug}", "content": base64.b64encode(content.encode()).decode(), "sha": current["sha"], "branch": GITHUB_BRANCH})


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/visibility")
def set_visibility(payload: VisibilityIn) -> dict[str, Any]:
    update_github_visibility(payload.slug, payload.hidden)
    conn = db()
    conn.execute("UPDATE posts SET hidden = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?", (int(payload.hidden), payload.slug))
    conn.commit()
    conn.close()
    return {"slug": payload.slug, "hidden": payload.hidden, "deployment": "github-pages-triggered"}


@app.get("/api/posts")
def list_posts(include_hidden: bool = True, status: str | None = None) -> list[dict[str, Any]]:
    conn = db(); query = "SELECT * FROM posts"; args: list[Any] = []; clauses = []
    if not include_hidden: clauses.append("hidden = 0")
    if status: clauses.append("status = ?"); args.append(status)
    if clauses: query += " WHERE " + " AND ".join(clauses)
    query += " ORDER BY updated_at DESC, id DESC"
    result = [row(item) for item in conn.execute(query, args).fetchall()]; conn.close(); return result


@app.post("/api/posts", status_code=201)
def create_post(payload: PostIn) -> dict[str, Any]:
    conn = db()
    try:
        values = payload.model_dump(); cursor = conn.execute("INSERT INTO posts (slug,title,excerpt,content,repo_url,repo_name,language,stars,status,hidden,source) VALUES (?,?,?,?,?,?,?,?,?,?,?)", (values["slug"], values["title"], values["excerpt"], values["content"], values["repo_url"], values["repo_name"], values["language"], values["stars"], values["status"], int(values["hidden"]), "manual")); conn.commit(); return row(conn.execute("SELECT * FROM posts WHERE id = ?", (cursor.lastrowid,)).fetchone())
    except sqlite3.IntegrityError as exc: raise HTTPException(409, "A post or repository with that slug already exists") from exc
    finally: conn.close()


@app.patch("/api/posts/{post_id}")
def update_post(post_id: int, payload: PostPatch) -> dict[str, Any]:
    changes = {key: value for key, value in payload.model_dump().items() if value is not None}
    if not changes: raise HTTPException(400, "No changes supplied")
    if "hidden" in changes: changes["hidden"] = int(changes["hidden"])
    conn = db(); assignments = ", ".join(f"{key} = ?" for key in changes); values = list(changes.values()) + [post_id]
    cursor = conn.execute(f"UPDATE posts SET {assignments}, updated_at = CURRENT_TIMESTAMP WHERE id = ?", values); conn.commit()
    if cursor.rowcount == 0: raise HTTPException(404, "Post not found")
    result = row(conn.execute("SELECT * FROM posts WHERE id = ?", (post_id,)).fetchone()); conn.close(); return result


@app.delete("/api/posts/{post_id}", status_code=204)
def delete_post(post_id: int) -> None:
    conn = db(); conn.execute("DELETE FROM posts WHERE id = ?", (post_id,)); conn.commit(); conn.close()


@app.post("/api/posts/{post_id}/approve")
def approve_post(post_id: int) -> dict[str, Any]:
    return update_post(post_id, PostPatch(status="published", hidden=False))


def valid_signature(body: bytes, signature: str | None) -> bool:
    secret = os.getenv("GITHUB_WEBHOOK_SECRET")
    if not secret: return True
    if not signature or not signature.startswith("sha256="): return False
    digest = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(signature, f"sha256={digest}")


@app.post("/api/webhooks/github")
async def github_webhook(request: Request, x_hub_signature_256: str | None = Header(default=None), x_github_event: str | None = Header(default=None)) -> dict[str, str]:
    body = await request.body()
    if not valid_signature(body, x_hub_signature_256): raise HTTPException(401, "Invalid webhook signature")
    return {"received": x_github_event or "unknown"}


@app.post("/api/email/test")
def send_test_email() -> dict[str, str]:
    host, port, sender, recipient = (os.getenv(key) for key in ("SMTP_HOST", "SMTP_PORT", "SMTP_FROM", "APPROVAL_EMAIL"))
    if not all((host, port, sender, recipient)): raise HTTPException(503, "Configure SMTP_HOST, SMTP_PORT, SMTP_FROM, and APPROVAL_EMAIL")
    message = EmailMessage(); message["Subject"] = "Own Blog email integration"; message["From"] = sender; message["To"] = recipient; message.set_content("Your Own Blog email approval channel is connected.")
    with smtplib.SMTP(host, int(port), timeout=20) as smtp: smtp.starttls(); smtp.login(os.getenv("SMTP_USER", ""), os.getenv("SMTP_PASSWORD", "")); smtp.send_message(message)
    return {"status": "sent"}
