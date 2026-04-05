# Day 6 — Code Quality Score

## Features
- Check per repository for:
  - README file
  - License file (with license type)
  - Topics
  - Test folder (test, tests, or __tests__)
- Calculate quality score (0-100) for each repo
- Average quality score across all repos
- Top 5 high-quality repos

## Setup
1. npm install
2. Update .env with your GITHUB_TOKEN
3. npm run start

## Endpoints
- GET /api/health - Health check
- GET /api/quality/:username - Get code quality score for all repos
- GET /api/quality/:username/:repo - Get code quality score for specific repo

## Quality Score Scoring
Each repo receives up to 100 points:
- README present: +25 points
- License present: +25 points
- Topics added: +25 points
- Test folder exists: +25 points

## Test in Postman
- GET http://localhost:5000/api/quality/torvalds
- GET http://localhost:5000/api/quality/torvalds/linux