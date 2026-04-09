# Day 7 Working Build
Project progressing...

## API

- `GET /api/health` — health check
- `POST /api/score` — compute a portfolio score from:
  - `languagesCount` or `languages`
  - `repoCategoriesCount` or `repoCategories`
  - `stars`
  - `forks`
  - `followers`

Example request body:

```json
{
  "languagesCount": 4,
  "repoCategoriesCount": 3,
  "stars": 120,
  "forks": 40,
  "followers": 80
}
```
