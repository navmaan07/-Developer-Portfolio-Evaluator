# Day 13 Caching + Shareable URLs

This folder contains the Day 13 implementation with MongoDB caching and shareable report URLs for the Developer Portfolio Evaluator.

## Features

- **MongoDB Storage**: Reports stored in MongoDB with automatic TTL expiration
- **24-Hour Caching**: Reports cached for 24 hours using MongoDB TTL indexes
- **Shareable URLs**: Access reports via `/report/:username` routes
- **Full-Stack MERN**: React frontend with Express/MongoDB backend
- **Responsive Design**: Mobile-friendly report display

## Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **MongoDB Setup:**
   - For local MongoDB: Make sure MongoDB is running on `mongodb://localhost:27017`
   - For MongoDB Atlas: Update `MONGODB_URI` in `.env` file

3. **Environment Variables:**
   - Copy `.env` file and update MongoDB connection string if needed

## Run the Application

```bash
npm run dev
```

This will start both the server (port 5000) and client (Vite dev server).

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/reports/:username` - Get cached report by username
- `POST /api/reports` - Create new cached report
- `GET /api/reports` - Get all cached reports (debug)

## Shareable URLs

Reports are accessible via shareable URLs:
- `http://localhost:5173/report/username`
- Reports are cached for 24 hours in MongoDB
- TTL index automatically expires old reports

## Architecture

- **Frontend**: React with React Router for shareable URLs
- **Backend**: Express.js with MongoDB/Mongoose
- **Database**: MongoDB with TTL indexes for automatic expiration
- **Caching**: 24-hour TTL on report documents

## Example Usage

1. Visit the home page
2. Enter a GitHub username
3. View the generated/cached report
4. Share the URL `/report/username` with others
5. Reports remain cached for 24 hours

## Database Schema

```javascript
{
  username: String,
  profile: {
    name: String,
    avatar: String,
    bio: String,
    // ... other profile fields
  },
  scores: {
    overall: Number,
    activity: Number,
    quality: Number,
    community: Number,
    hiringReady: Number
  },
  repos: Array,
  languages: Array,
  createdAt: Date // TTL expires after 24 hours
}
```
