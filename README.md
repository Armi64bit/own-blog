# Own Blog

A personal publishing desk for **Armi64bit**. It presents GitHub repositories as draft stories, lets you hide anything you do not want to publish, supports manual posts, and keeps approval separate from visibility.

## Architecture

- `frontend/` — Next.js static export for GitHub Pages. The published site is intentionally serverless and reads the editorial state produced by the backend/build process.
- `backend/` — FastAPI service with SQLite CRUD, GitHub repository sync, signed webhook handling, approval endpoints, and SMTP test delivery.
- `client/` — Managed preview UI used during development; it mirrors the Next.js publishing desk so changes can be reviewed immediately.
- `.github/workflows/pages.yml` — builds and deploys `frontend/` to GitHub Pages on every push to `main`.

GitHub Pages cannot run FastAPI. Deploy `backend/` separately (Render, Fly.io, Railway, or Cloud Run), then set `NEXT_PUBLIC_API_URL`/your build sync step to that API. The backend may also be hosted on the managed web service with a custom Python runtime, but it must remain a separate HTTPS service from Pages.

## GitHub repository coverage

A GitHub App or organization webhook can subscribe to the `repository` event, including the `created` action. For a personal account, GitHub's repository webhooks are configured per repository, so the reliable fallback is the `POST /api/github/sync` endpoint (run after connecting, and periodically from a host cron). It syncs every non-fork repository owned by `GITHUB_OWNER`, preserving each repo's `hidden` value and turning new repos into drafts.

The approval flow is deliberately safe:

1. Sync creates or updates a draft post for every current repository.
2. You hide repos to keep them off the public blog without deleting their synchronized record.
3. You approve a draft only when you want to publish it.
4. A future sync updates metadata but does not overwrite your hidden or published state.

## Backend setup

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export GITHUB_OWNER=Armi64bit
export GITHUB_TOKEN=ghp_your_read_token
uvicorn main:app --reload --port 8000
```

Required production values are documented in `backend/.env.example` (configure these in your host's secret manager, not in Git). SMTP is used for the email approval channel; the next production iteration should render signed approve/hide links in each notification.

## GitHub App/webhook setup

Create a GitHub App with read-only repository metadata permission, enable webhooks, subscribe to `Repository`, and point its webhook URL at `https://YOUR-API/api/webhooks/github`. Set `GITHUB_WEBHOOK_SECRET` to the same high-entropy secret in the app and backend. For a personal-account-only setup without an App, call `/api/github/sync` after creating a repository or schedule it on the API host.

## GitHub Pages

The public repository is [github.com/Armi64bit/own-blog](https://github.com/Armi64bit/own-blog). After the first push, GitHub Actions will publish the static export at `https://armi64bit.github.io/own-blog/`. In repository settings, Pages should use **GitHub Actions** as the source.

## API surface

`GET /api/posts`, `POST /api/posts`, `PATCH /api/posts/{id}`, `DELETE /api/posts/{id}`, `POST /api/posts/{id}/approve`, `POST /api/github/sync`, and `POST /api/webhooks/github`.
