import express from 'express';
import Report from '../models/Report.js';
import { fetchUserProfile, fetchUserRepos, fetchUserEvents, getRepoDetails, checkRepoHasTests, calculateLanguageDistribution } from '../services/githubService.js';
import { extractUsername } from '../utils/githubUtils.js';
import { calculateScores } from '../services/scoringService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * GET /api/profile/:username
 * Fetch and score a GitHub profile
 */
router.get('/profile/:username', asyncHandler(async (req, res) => {
  let { username } = req.params;

  // Saniitize username (support URLs)
  username = extractUsername(username);

  if (!username) {
    return res.status(400).json({
      error: 'Invalid Input',
      message: 'Please provide a valid GitHub username or profile URL'
    });
  }

  // Check for cached report
  const cachedReport = await Report.findOne({
    username,
    expiresAt: { $gt: new Date() }
  });

  if (cachedReport) {
    return res.json({
      ...cachedReport.toObject(),
      cached: true,
      cacheExpiresAt: cachedReport.expiresAt
    });
  }

  // Fetch fresh data from GitHub
  const [user, repos, events] = await Promise.all([
    fetchUserProfile(username),
    fetchUserRepos(username),
    fetchUserEvents(username)
  ]);

  // Get additional repo details (Optimized: limit to top 5 for performance and quota management)
  const repoDetails = await Promise.all(
    repos.slice(0, 5).map(async (repo) => {
      try {
        const [details, hasTests] = await Promise.all([
          getRepoDetails(username, repo.name),
          checkRepoHasTests(username, repo.name)
        ]);

        return {
          ...repo,
          hasReadme: details.hasReadme,
          hasLicense: details.hasLicense,
          hasTests
        };
      } catch (err) {
        console.warn(`Could not fetch details for repo ${repo.name}: ${err.message}`);
        return {
          ...repo,
          hasReadme: false,
          hasLicense: false,
          hasTests: false
        };
      }
    })
  );

  // Calculate scores
  const scores = await calculateScores(user, repoDetails, events);

  // Calculate language distribution
  const languages = calculateLanguageDistribution(repos);

  // Prepare top repos data
  const topRepos = repoDetails.slice(0, 6).map(repo => ({
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    url: repo.html_url,
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    language: repo.language,
    topics: repo.topics || [],
    hasReadme: repo.hasReadme,
    hasLicense: repo.hasLicense,
    hasTests: repo.hasTests,
    createdAt: repo.created_at,
    updatedAt: repo.updated_at
  }));

  // Create report data
  const reportData = {
    username,
    avatarUrl: user.avatar_url,
    name: user.name,
    bio: user.bio,
    blog: user.blog,
    location: user.location,
    email: user.email,
    company: user.company,
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
    publicGists: user.public_gists,
    hireable: user.hireable,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    scores,
    topRepos,
    languages,
    contributions: {
      totalCommits: events.filter(e => e.type === 'PushEvent').length,
      commitsLast90Days: events.filter(e => {
        const eventDate = new Date(e.created_at);
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        return eventDate >= ninetyDaysAgo && e.type === 'PushEvent';
      }).length
    }
  };

  // Save to database with TTL (Upsert to avoid duplicate key errors)
  const report = await Report.findOneAndUpdate(
    { username },
    { 
      ...reportData,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Reset TTL on fresh analysis
    },
    { upsert: true, new: true, runValidators: true }
  );

  res.json({
    ...reportData,
    cached: false,
    shareUrl: report.shareUrl
  });
}));

/**
 * GET /api/profile/:username/cached
 * Return cached report if available
 */
router.get('/profile/:username/cached', asyncHandler(async (req, res) => {
  const { username } = req.params;

  const report = await Report.findOne({
    username,
    expiresAt: { $gt: new Date() }
  });

  if (!report) {
    return res.status(404).json({
      error: 'No cached report found',
      message: 'Please generate a fresh report first'
    });
  }

  res.json({
    ...report.toObject(),
    cached: true,
    cacheExpiresAt: report.expiresAt
  });
}));

/**
 * GET /api/compare
 * Compare two GitHub profiles
 */
router.get('/compare', asyncHandler(async (req, res) => {
  const { u1, u2 } = req.query;

  if (!u1 || !u2) {
    return res.status(400).json({
      error: 'Missing parameters',
      message: 'Please provide u1 and u2 query parameters'
    });
  }

  // Fetch both reports
  const [report1, report2] = await Promise.all([
    Report.findOne({ username: u1, expiresAt: { $gt: new Date() } }),
    Report.findOne({ username: u2, expiresAt: { $gt: new Date() } })
  ]);

  if (!report1 || !report2) {
    return res.status(404).json({
      error: 'Reports not available',
      message: 'Both users must have cached reports. Generate reports first.'
    });
  }

  res.json({
    user1: report1.toObject(),
    user2: report2.toObject(),
    comparison: {
      winner: {
        activity: report1.scores.activity > report2.scores.activity ? u1 : u2,
        codeQuality: report1.scores.codeQuality > report2.scores.codeQuality ? u1 : u2,
        diversity: report1.scores.diversity > report2.scores.diversity ? u1 : u2,
        community: report1.scores.community > report2.scores.community ? u1 : u2,
        hiringReady: report1.scores.hiringReady > report2.scores.hiringReady ? u1 : u2,
        overall: report1.scores.overall > report2.scores.overall ? u1 : u2
      }
    }
  });
}));

/**
 * GET /api/reports
 * Get all cached reports (admin/debug endpoint)
 */
router.get('/reports', asyncHandler(async (req, res) => {
  const reports = await Report.find()
    .select('username name scores.overall cachedAt expiresAt')
    .sort({ cachedAt: -1 });

  res.json(reports);
}));

export default router;
