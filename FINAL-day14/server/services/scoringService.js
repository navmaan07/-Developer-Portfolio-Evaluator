
/**
 * Calculate activity score based on commit patterns and streaks
 * Weight: 25% of total score
 */
const calculateActivityScore = (events, repos) => {
  if (!events || events.length === 0) return 0;

  // Filter push events from last 90 days
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const recentEvents = events.filter(event => {
    const eventDate = new Date(event.created_at);
    return eventDate >= ninetyDaysAgo && event.type === 'PushEvent';
  });

  // Count commits in last 90 days (max 20 points)
  const commitsLast90Days = recentEvents.length;
  const commitScore = Math.min(commitsLast90Days * 2, 20);

  // Calculate streak consistency (max 5 points)
  const streakScore = calculateStreakScore(recentEvents);

  return Math.round(commitScore + streakScore);
};

/**
 * Calculate streak score based on consistency
 */
const calculateStreakScore = (events) => {
  if (events.length < 5) return 0;

  // Sort events by date
  const sortedEvents = events
    .map(event => new Date(event.created_at).toDateString())
    .filter((date, index, arr) => arr.indexOf(date) === index)
    .sort((a, b) => new Date(b) - new Date(a));

  let currentStreak = 1;
  let maxStreak = 1;

  for (let i = 1; i < sortedEvents.length; i++) {
    const prevDate = new Date(sortedEvents[i - 1]);
    const currDate = new Date(sortedEvents[i]);
    const diffTime = Math.abs(currDate - prevDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  // Score based on max streak (max 5 points)
  return Math.min(maxStreak, 5);
};

/**
 * Calculate code quality score based on repository standards
 * Weight: 20% of total score
 */
const calculateCodeQualityScore = (repos) => {
  if (!repos || repos.length === 0) return 0;

  let totalScore = 0;
  const maxScorePerRepo = 4; // README + License + Topics + Tests

  for (const repo of repos.slice(0, 10)) { // Check top 10 repos
    let repoScore = 0;

    // README (+1)
    if (repo.description || repo.hasReadme) repoScore += 1;

    // License (+1)
    if (repo.license || repo.hasLicense) repoScore += 1;

    // Topics (+1)
    if (repo.topics && repo.topics.length > 0) repoScore += 1;

    // Tests folder (+1)
    if (repo.hasTests) repoScore += 1;

    totalScore += repoScore;
  }

  // Average score across repos, scaled to 0-100
  const averageScore = totalScore / Math.min(repos.length, 10);
  return Math.round((averageScore / maxScorePerRepo) * 100);
};

/**
 * Calculate diversity score based on languages and project types
 * Weight: 20% of total score
 */
const calculateDiversityScore = (repos) => {
  if (!repos || repos.length === 0) return 0;

  const languages = new Set();
  const topics = new Set();

  repos.forEach(repo => {
    if (repo.language) languages.add(repo.language);
    if (repo.topics) {
      repo.topics.forEach(topic => topics.add(topic));
    }
  });

  // Language diversity (max 10 points)
  const languageScore = Math.min(languages.size * 2, 10);

  // Topic diversity (max 10 points)
  const topicScore = Math.min(topics.size, 10);

  return Math.round(((languageScore + topicScore) / 20) * 100);
};

/**
 * Calculate community score based on stars, forks, and followers
 * Weight: 20% of total score
 */
const calculateCommunityScore = (user, repos) => {
  let score = 0;

  // Stars and forks score (logarithmic scale)
  const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
  const totalForks = repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);

  const starForkScore = Math.min(Math.log10(totalStars + totalForks + 1) * 10, 15);

  // Followers bonus
  const followerBonus = user.followers > 50 ? 5 : Math.min(user.followers / 10, 5);

  score = starForkScore + followerBonus;

  return Math.round(Math.min(score, 100));
};

/**
 * Calculate hiring readiness score based on profile completeness
 * Weight: 15% of total score
 */
const calculateHiringReadyScore = (user) => {
  let score = 0;

  // Bio filled (+20)
  if (user.bio && user.bio.trim().length > 0) score += 20;

  // Website set (+20)
  if (user.blog && user.blog.trim().length > 0) score += 20;

  // Email public (+20)
  if (user.email && user.email.trim().length > 0) score += 20;

  // Company set (+20)
  if (user.company && user.company.trim().length > 0) score += 20;

  // Location set (+20)
  if (user.location && user.location.trim().length > 0) score += 20;

  return score;
};

/**
 * Calculate overall score with weighted average
 */
const calculateOverallScore = (scores) => {
  const weights = {
    activity: 0.25,
    codeQuality: 0.20,
    diversity: 0.20,
    community: 0.20,
    hiringReady: 0.15
  };

  const weightedSum = Object.entries(scores).reduce((sum, [key, value]) => {
    return sum + (value * (weights[key] || 0));
  }, 0);

  return Math.round(weightedSum);
};

/**
 * Main scoring function
 */
export const calculateScores = async (user, repos, events) => {
  const activity = calculateActivityScore(events, repos);
  const codeQuality = calculateCodeQualityScore(repos);
  const diversity = calculateDiversityScore(repos);
  const community = calculateCommunityScore(user, repos);
  const hiringReady = calculateHiringReadyScore(user);

  const overall = calculateOverallScore({
    activity,
    codeQuality,
    diversity,
    community,
    hiringReady
  });

  return {
    activity,
    codeQuality,
    diversity,
    community,
    hiringReady,
    overall
  };
};

/**
 * Legacy score function for backward compatibility
 */
export const score = () => ({
  activity: 10,
  codeQuality: 10,
  diversity: 10,
  community: 10,
  hiringReady: 10,
  overall: 50
});

