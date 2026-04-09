const mapThresholdScore = (value, thresholds) => {
  const count = Number.isFinite(value) ? value : 0;
  for (const entry of thresholds) {
    if (count <= entry.max) {
      return entry.score;
    }
  }
  return thresholds[thresholds.length - 1].score;
};

const hasValue = (value) => {
  if (typeof value === 'string') return value.trim().length > 0;
  return value !== undefined && value !== null && value !== '';
};

const calculateActivityScore = (activityData) => {
  return activityData.activityScore || 0;
};

const calculateCodeQualityScore = (repos) => {
  if (!repos || repos.length === 0) return 0;

  let score = 0;
  const qualityRepos = repos.filter((r) => r.watchers_count > 0 || r.forks_count > 0 || r.description);
  const qualityRatio = qualityRepos.length / repos.length;

  if (qualityRatio >= 0.8) score = 10;
  else if (qualityRatio >= 0.6) score = 8;
  else if (qualityRatio >= 0.4) score = 6;
  else if (qualityRatio >= 0.2) score = 4;
  else score = 2;

  return score;
};

const calculateDiversityScore = (languagesCount, repoCategoriesCount) => {
  const languageScore = mapThresholdScore(languagesCount, [
    { max: 0, score: 0 },
    { max: 1, score: 2 },
    { max: 2, score: 4 },
    { max: 3, score: 6 },
    { max: 4, score: 8 },
    { max: Infinity, score: 10 },
  ]);

  const categoryScore = mapThresholdScore(repoCategoriesCount, [
    { max: 0, score: 0 },
    { max: 1, score: 2 },
    { max: 2, score: 4 },
    { max: 3, score: 6 },
    { max: 4, score: 8 },
    { max: Infinity, score: 10 },
  ]);

  return Math.round((languageScore * 0.6 + categoryScore * 0.4) * 10) / 10;
};

const calculateCommunityScore = (profile) => {
  const starScore = mapThresholdScore(profile.public_repos || 0, [
    { max: 0, score: 0 },
    { max: 5, score: 2 },
    { max: 20, score: 4 },
    { max: 50, score: 6 },
    { max: 150, score: 8 },
    { max: Infinity, score: 10 },
  ]);

  const forkScore = mapThresholdScore(profile.followers || 0, [
    { max: 0, score: 0 },
    { max: 5, score: 2 },
    { max: 20, score: 4 },
    { max: 50, score: 6 },
    { max: 150, score: 8 },
    { max: Infinity, score: 10 },
  ]);

  const followerScore = mapThresholdScore(profile.followers || 0, [
    { max: 0, score: 0 },
    { max: 5, score: 1 },
    { max: 15, score: 3 },
    { max: 50, score: 5 },
    { max: 200, score: 8 },
    { max: Infinity, score: 10 },
  ]);

  return Math.round((starScore * 0.4 + forkScore * 0.3 + followerScore * 0.3) * 10) / 10;
};

const calculateHiringReadyScore = (profile) => {
  const bioScore = hasValue(profile.bio) ? 2 : 0;
  const websiteScore = hasValue(profile.blog) ? 2 : 0;
  const emailScore = hasValue(profile.email) ? 2 : 0;
  const pinnedReposScore = mapThresholdScore(profile.public_repos || 0, [
    { max: 0, score: 0 },
    { max: 1, score: 1 },
    { max: 2, score: 2 },
    { max: 3, score: 3 },
    { max: Infinity, score: 4 },
  ]);

  return Math.round((bioScore + websiteScore + emailScore + pinnedReposScore) * 10) / 10;
};

export const calculateScore = async (profile, repos, activity, languagesCount, repoCategoriesCount) => {
  const activity_score = calculateActivityScore(activity);
  const codeQuality = calculateCodeQualityScore(repos);
  const diversity = calculateDiversityScore(languagesCount, repoCategoriesCount);
  const community = calculateCommunityScore(profile);
  const hiringReady = calculateHiringReadyScore(profile);
  const overall = Math.round((activity_score + codeQuality + diversity + community + hiringReady) * 10) / 10;

  return {
    activity: activity_score,
    codeQuality,
    diversity,
    community,
    hiringReady,
    overall,
  };
};

