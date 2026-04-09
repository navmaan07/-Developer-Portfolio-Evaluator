
const hasValue = (value) => {
  if (typeof value === 'string') return value.trim().length > 0;
  return value !== undefined && value !== null && value !== '';
};

const mapThresholdScore = (value, thresholds) => {
  const count = Number.isFinite(value) ? value : Number(value) || 0;

  for (const entry of thresholds) {
    if (count <= entry.max) {
      return entry.score;
    }
  }

  return thresholds[thresholds.length - 1].score;
};

const calculateHiringReadyScore = ({ bio, website, email, pinnedReposCount }) => {
  const bioScore = hasValue(bio) ? 2 : 0;
  const websiteScore = hasValue(website) ? 2 : 0;
  const emailScore = hasValue(email) ? 2 : 0;
  const pinnedReposScore = mapThresholdScore(pinnedReposCount, [
    { max: 0, score: 0 },
    { max: 1, score: 1 },
    { max: 2, score: 2 },
    { max: 3, score: 3 },
    { max: Infinity, score: 4 },
  ]);

  return Math.round((bioScore + websiteScore + emailScore + pinnedReposScore) * 10) / 10;
};

export const score = (input = {}) => {
  const hiringReady = calculateHiringReadyScore({
    bio: input.bio,
    website: input.website,
    email: input.email,
    pinnedReposCount: input.pinnedReposCount ?? input.pinnedRepos,
  });

  const activity = 10;
  const codeQuality = 10;
  const diversity = 10;
  const community = 10;
  const overall = Math.round((activity + codeQuality + diversity + community + hiringReady) * 10) / 10;

  return {
    activity,
    codeQuality,
    diversity,
    community,
    hiringReady,
    overall,
  };
};
