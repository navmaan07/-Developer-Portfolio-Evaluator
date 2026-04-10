# Day 10 — Developer Portfolio Evaluator (Complete MERN Application)

Full-stack MERN application with React Router, complete profile API, and comprehensive portfolio scoring.

## Features

✅ **Frontend (React + Vite)**
- React Router for navigation
- Home page with search UI
- Detailed report page with scoring breakdown
- SearchBar component for GitHub username lookup
- Responsive design with modern styling

✅ **Backend (Express + Node.js)**
- GitHub API integration using Octokit
- Complete profile endpoint: `GET /api/profile/:username`
- Comprehensive scoring system
- Error handling for invalid users

✅ **Scoring Metrics**
- Activity Score (commits + streaks)
- Code Quality Score
- Diversity Score (languages + categories)
- Community Score (followers + public repos)
- Hiring Readiness Score (bio + website + email)
- Overall Combined Score

## Project Structure

```
day10/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── SearchBar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── Report.jsx
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   ├── App.css
│   │   │   ├── Home.css
│   │   │   ├── SearchBar.css
│   │   │   └── Report.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                    # Express backend
│   ├── services/
│   │   ├── githubService.js
│   │   └── scoringService.js
│   ├── app.js
│   ├── .env
│   └── package.json
└── README.md
```

## Setup Instructions

### 1. Get GitHub Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Select scopes: `public_repo`, `read:user`
4. Copy the token

### 2. Install Dependencies

```bash
cd day10
npm install

cd client
npm install

cd ../server
npm install
```

### 3. Configure Environment

Create `.env` in `day10/server/`:

```
GITHUB_TOKEN=your_github_token_here
```

### 4. Run the Application

**Option A: Run both server and client together**

From `day10/` root:

```bash
npm run dev
```

**Option B: Run separately**

Terminal 1 - Start Server:
```bash
cd server
npm start
```

Terminal 2 - Start Client:
```bash
cd client
npm run dev
```

Server runs on: `http://localhost:5000`
Client runs on: `http://localhost:3000`

## Usage

1. Open `http://localhost:3000` in your browser
2. Enter a GitHub username (e.g., `torvalds`, `gvanrossum`, `mojombo`)
3. View comprehensive portfolio analysis including:
   - Profile information (avatar, bio, location)
   - Individual scores for each metric
   - Detailed metrics breakdown
   - Overall score calculation

## API Endpoints

### Health Check
```
GET /api/health
```

### Get Profile Report
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
    "followers": 160000,
    "publicRepos": 5
  },
  "metrics": {
    "repositoriesCount": 5,
    "languagesCount": 3,
    "categoriesCount": 2,
    "commitsLast90Days": 15,
    "currentStreak": 2,
    "longestStreak": 10
  },
  "scores": {
    "activity": 25,
    "codeQuality": 8,
    "diversity": 5.2,
    "community": 8.1,
    "hiringReady": 6,
    "overall": 52.3
  }
}
```

## Error Handling

- **400 Bad Request** - Missing or invalid username
- **404 Not Found** - User does not exist on GitHub  
- **500 Server Error** - Server-side processing error

Example error response:
```json
{"error":"User 'invaliduser' not found"}
```

## Commit Message

```
Day 10 – Setup frontend routing and built search UI with React Router
```

## Technology Stack

- **Frontend**: React 18, React Router 6, Vite
- **Backend**: Express.js, Node.js
- **API**: GitHub REST API (Octokit)
- **Styling**: CSS3 with gradients and responsive design
- **Build**: Vite for fast development

## Notes

- The GitHub API has rate limits (60 requests/hour without auth, 5000/hour with auth)
- Make sure your GitHub token has the correct permissions
- CORS is enabled on the backend for local development
- The application fetches real-time data from GitHub APIs
