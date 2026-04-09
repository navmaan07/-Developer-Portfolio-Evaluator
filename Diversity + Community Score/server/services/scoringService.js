
const mapThresholdScore = (value, thresholds) => {
  const normalized = Number.isFinite(value) ? value : 0;

  for (const entry of thresholds) {
    if (normalized <= entry.max) {
      return entry.score;
    }
  }

  return thresholds[thresholds.length - 1].score;
};

const getCount = (value) => {
  if (Array.isArray(value)) return value.length;
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') return Number(value) || 0;
  return 0;
};

const calculateDiversityScore = ({ languagesCount, repoCategoriesCount }) => {
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

const calculateCommunityScore = ({ stars, forks, followers }) => {
  const starScore = mapThresholdScore(stars, [
    { max: 0, score: 0 },
    { max: 5, score: 2 },
    { max: 20, score: 4 },
    { max: 50, score: 6 },
    { max: 150, score: 8 },
    { max: Infinity, score: 10 },
  ]);

  const forkScore = mapThresholdScore(forks, [
    { max: 0, score: 0 },
    { max: 5, score: 2 },
    { max: 20, score: 4 },
    { max: 50, score: 6 },
    { max: 150, score: 8 },
    { max: Infinity, score: 10 },
  ]);

  const followerScore = mapThresholdScore(followers, [
    { max: 0, score: 0 },
    { max: 5, score: 1 },
    { max: 15, score: 3 },
    { max: 50, score: 5 },
    { max: 200, score: 8 },
    { max: Infinity, score: 10 },
  ]);

  return Math.round((starScore * 0.4 + forkScore * 0.3 + followerScore * 0.3) * 10) / 10;
};

export const score = (input = {}) => {
  const languagesCount = getCount(input.languagesCount ?? input.languages);
  const repoCategoriesCount = getCount(input.repoCategoriesCount ?? input.repoCategories);
  const stars = getCount(input.stars);
  const forks = getCount(input.forks);
  const followers = getCount(input.followers);

  const diversity = calculateDiversityScore({ languagesCount, repoCategoriesCount });
  const community = calculateCommunityScore({ stars, forks, followers });

  const activity = 10;
  const codeQuality = 10;
  const hiringReady = 10;
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
