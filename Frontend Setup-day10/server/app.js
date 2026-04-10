
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  getUserProfile,
  getUserRepos,
  getLanguagesCount,
  getRepoCategoriesCount,
  getPinnedReposCount,
  getUserActivity,
} from './services/githubService.js';
import { calculateScore } from './services/scoringService.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', day: 10 }));

app.get('/api/profile/:username', async (req, res) => {
  try {
    const { username } = req.params;

    if (!username || username.trim() === '') {
      return res.status(400).json({ error: 'Username is required' });
    }

    const profile = await getUserProfile(username);
    const repos = await getUserRepos(username);
    const activity = await getUserActivity(username);
    const languagesCount = await getLanguagesCount(username);
    const repoCategoriesCount = await getRepoCategoriesCount(username);
    const pinnedReposCount = await getPinnedReposCount(username);

    const scores = await calculateScore(profile, repos, activity, languagesCount, repoCategoriesCount);

    const report = {
      profile: {
        username: profile.login,
        name: profile.name,
        bio: profile.bio,
        avatar: profile.avatar_url,
        website: profile.blog,
        email: profile.email,
        location: profile.location,
        followers: profile.followers,
        following: profile.following,
        publicRepos: profile.public_repos,
        createdAt: profile.created_at,
      },
      metrics: {
        repositoriesCount: repos.length,
        languagesCount,
        categoriesCount: repoCategoriesCount,
        pinnedReposCount,
        commitsLast90Days: activity.commitsLast90Days,
        currentStreak: activity.currentStreak,
        longestStreak: activity.longestStreak,
      },
      scores,
    };

    res.json(report);
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: `User '${req.params.username}' not found` });
    }
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));

