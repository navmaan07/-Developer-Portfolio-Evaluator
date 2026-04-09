import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

dotenv.config();

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

const getUserProfile = async (username) => {
  try {
    const { data } = await octokit.users.getByUsername({ username });
    return data;
  } catch (error) {
    throw new Error(`User ${username} not found: ${error.message}`);
  }
};

const getUserRepos = async (username) => {
  try {
    const { data } = await octokit.repos.listForUser({ username, per_page: 100 });
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch repos for ${username}: ${error.message}`);
  }
};

const getLanguagesCount = async (username) => {
  try {
    const repos = await getUserRepos(username);
    const languages = new Set();
    for (const repo of repos) {
      const { data } = await octokit.repos.listLanguages({ owner: username, repo: repo.name });
      Object.keys(data).forEach((lang) => languages.add(lang));
    }
    return languages.size;
  } catch (error) {
    return 0;
  }
};

const getRepoCategoriesCount = async (username) => {
  try {
    const repos = await getUserRepos(username);
    const topics = new Set();
    repos.forEach((repo) => {
      if (repo.topics && Array.isArray(repo.topics)) {
        repo.topics.forEach((topic) => topics.add(topic));
      }
    });
    return topics.size;
  } catch (error) {
    return 0;
  }
};

const getPinnedReposCount = async (username) => {
  try {
    const repos = await getUserRepos(username);
    return repos.filter((repo) => repo.stargazers_count > 10).length;
  } catch (error) {
    return 0;
  }
};

const getUserActivity = async (username) => {
  try {
    const now = new Date();
    const sinceDate = new Date(now.getTime() - NINETY_DAYS_MS);

    const events = await octokit.paginate(octokit.activity.listPublicEventsForUser, {
      username,
      per_page: 100,
    });

    const recentPushEvents = events.filter((event) => {
      const eventDate = new Date(event.created_at);
      return event.type === 'PushEvent' && eventDate >= sinceDate;
    });

    let commitsLast90Days = 0;
    const commitDaySet = new Set();

    recentPushEvents.forEach((event) => {
      const eventDate = new Date(event.created_at);
      const commitDay = eventDate.toISOString().slice(0, 10);
      if (event.payload?.commits?.length) {
        commitsLast90Days += event.payload.commits.length;
        commitDaySet.add(commitDay);
      }
    });

    const commitDays = [...commitDaySet].sort();
    const streakData = calculateStreaks(commitDays, now);
    const activityScore = calculateActivityScore(commitsLast90Days, streakData.currentStreak);

    return {
      commitsLast90Days,
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
      activityScore,
    };
  } catch (error) {
    return {
      commitsLast90Days: 0,
      currentStreak: 0,
      longestStreak: 0,
      activityScore: 0,
    };
  }
};

const calculateStreaks = (commitDays, now) => {
  if (!commitDays.length) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const parseDay = (day) => new Date(`${day}T00:00:00Z`);
  let longestStreak = 1;
  let currentStreak = 1;
  let tempStreak = 1;

  for (let i = 1; i < commitDays.length; i += 1) {
    const previous = parseDay(commitDays[i - 1]);
    const current = parseDay(commitDays[i]);
    const dayDiff = Math.round((current - previous) / (24 * 60 * 60 * 1000));

    if (dayDiff === 1) {
      tempStreak += 1;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else if (dayDiff > 1) {
      tempStreak = 1;
    }
  }

  currentStreak = 1;
  for (let i = commitDays.length - 1; i > 0; i -= 1) {
    const current = parseDay(commitDays[i]);
    const previous = parseDay(commitDays[i - 1]);
    const dayDiff = Math.round((current - previous) / (24 * 60 * 60 * 1000));

    if (dayDiff === 1) {
      currentStreak += 1;
    } else {
      break;
    }
  }

  const lastCommitDay = parseDay(commitDays[commitDays.length - 1]);
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const daysSinceLastCommit = Math.round((today - lastCommitDay) / (24 * 60 * 60 * 1000));

  if (daysSinceLastCommit > 1) {
    currentStreak = 0;
  }

  return { currentStreak, longestStreak };
};

const calculateActivityScore = (commitCount, currentStreak) => {
  let commitScore = 0;
  if (commitCount === 0) commitScore = 0;
  else if (commitCount <= 10) commitScore = 10;
  else if (commitCount <= 30) commitScore = 25;
  else if (commitCount <= 60) commitScore = 45;
  else if (commitCount <= 90) commitScore = 65;
  else commitScore = 80;

  let streakScore = 0;
  if (currentStreak <= 0) streakScore = 0;
  else if (currentStreak <= 3) streakScore = 10;
  else if (currentStreak <= 7) streakScore = 20;
  else if (currentStreak <= 14) streakScore = 30;
  else if (currentStreak <= 30) streakScore = 40;
  else streakScore = 50;

  return Math.min(100, commitScore + streakScore);
};

export { getUserProfile, getUserRepos, getLanguagesCount, getRepoCategoriesCount, getPinnedReposCount, getUserActivity };

