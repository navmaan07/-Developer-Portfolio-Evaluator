# Day 8 Working Build
Project progressing...

## API

- `GET /api/health` — health check
- `POST /api/score` — calculate hiring readiness and overall score

Request body fields:

- `bio` — non-empty user bio
- `website` — personal website URL
- `email` — contact email
- `pinnedReposCount` or `pinnedRepos` — number of pinned repos

Example request body:

```json
{
  "bio": "Full-stack developer with open-source experience",
  "website": "https://example.com",
  "email": "user@example.com",
  "pinnedReposCount": 4
}
```
