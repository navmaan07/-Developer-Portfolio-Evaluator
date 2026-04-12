
import { Octokit } from 'octokit';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

/**
 * Fetch user profile data from GitHub
 */
export const fetchUserProfile = async (username) => {
  try {
    const { data } = await octokit.request('GET /users/{username}', {
      username
    });
    return data;
  } catch (error) {
    if (error.status === 404) {
      throw new Error(`GitHub user '${username}' not found`);
    }
    throw new Error(`Failed to fetch user profile: ${error.message}`);
  }
};

/**
 * Fetch user repositories
 */
export const fetchUserRepos = async (username) => {
  try {
    const { data } = await octokit.request('GET /users/{username}/repos', {
      username,
      per_page: 100,
      sort: 'updated',
      direction: 'desc'
    });
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch repositories: ${error.message}`);
  }
};

/**
 * Fetch user events (for activity scoring)
 */
export const fetchUserEvents = async (username) => {
  try {
    const { data } = await octokit.request('GET /users/{username}/events/public', {
      username,
      per_page: 100
    });
    return data;
  } catch (error) {
    // If events are not found (404), return empty array instead of failing
    if (error.status === 404) {
      console.log(`No public events found for user '${username}'`);
      return [];
    }
    // For other errors (like 403 rate limit), log but don't crash if possible
    console.error(`Failed to fetch user events for '${username}': ${error.message}`);
    return [];
  }
};

/**
 * Check if repository has tests folder
 */
export const checkRepoHasTests = async (owner, repo) => {
  try {
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path: ''
    });

    // Check for common test folder names
    const testFolders = ['test', 'tests', '__tests__', 'spec', 'specs'];
    return data && Array.isArray(data) ? data.some(item =>
      item.type === 'dir' &&
      testFolders.some(testFolder => item.name.toLowerCase().includes(testFolder))
    ) : false;
  } catch (error) {
    // If rate limited or not found, just return false for tests
    return false;
  }
};

/**
 * Get repository details including README and license
 */
export const getRepoDetails = async (owner, repo) => {
  try {
    const [readme, license] = await Promise.allSettled([
      octokit.request('GET /repos/{owner}/{repo}/readme', { owner, repo }),
      octokit.request('GET /repos/{owner}/{repo}/license', { owner, repo })
    ]);

    return {
      hasReadme: readme.status === 'fulfilled',
      hasLicense: license.status === 'fulfilled'
    };
  } catch (error) {
    return {
      hasReadme: false,
      hasLicense: false
    };
  }
};

/**
 * Calculate language distribution for user
 */
export const calculateLanguageDistribution = (repos) => {
  const languageStats = {};

  repos.forEach(repo => {
    if (repo.language) {
      languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
    }
  });

  const total = Object.values(languageStats).reduce((sum, count) => sum + count, 0);

  return Object.entries(languageStats)
    .map(([name, count]) => ({
      name,
      percentage: Math.round((count / total) * 100),
      color: getLanguageColor(name)
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 8); // Top 8 languages
};

/**
 * Get color for programming language
 */
const getLanguageColor = (language) => {
  const colors = {
    JavaScript: '#f7df1e',
    TypeScript: '#3178c6',
    Python: '#3776ab',
    Java: '#007396',
    'C++': '#00599c',
    'C#': '#239120',
    PHP: '#777bb4',
    Ruby: '#cc342d',
    Go: '#00add8',
    Rust: '#000000',
    Swift: '#fa7343',
    Kotlin: '#7f52ff',
    Dart: '#00b4ab',
    HTML: '#e34f26',
    CSS: '#1572b6',
    Shell: '#89e051',
    Vue: '#4fc08d',
    React: '#61dafb'
  };
  return colors[language] || '#586069';
};

