# Day 9 Working Build - Profile API

Complete profile API with full scoring and GitHub integration.

## Setup

```bash
cd day9
npm install
```

Create a `.env` file with your GitHub token:

```
GITHUB_TOKEN=your_github_token_here
```

## Run

```bash
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

### Health Check

```
GET /api/health
```

Response:
```json
{"status":"ok","day":9}
```

### Get Full Profile Report

```
GET /api/profile/:username
```

Example:
```
http://localhost:5000/api/profile/torvalds
```

Response:
```json
{
  "profile": {
    "username": "torvalds",
    "name": "Linus Torvalds",
    "bio": "...",
    "avatar": "https://...",
    "website": "...",
    "email": "...",
    "location": "...",
    "followers": 123456,
    "following": 0,
    "publicRepos": 456
  },
  "metrics": {
    "repositoriesCount": 456,
    "languagesCount": 12,
    "categoriesCount": 5,
    "pinnedReposCount": 8,
    "commitsLast90Days": 123,
    "currentStreak": 5,
    "longestStreak": 45
  },
  "scores": {
    "activity": 8.5,
    "codeQuality": 9,
    "diversity": 8.4,
    "community": 9,
    "hiringReady": 7,
    "overall": 42.9
  }
}
```

## Error Handling

- **400** — Missing or invalid username
- **404** — User not found
- **500** — Server error

Example error response:
```json
{"error":"User 'invaliduser' not found"}
```
