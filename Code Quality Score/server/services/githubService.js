
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

dotenv.config();

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export const getUser = async (username) => {
  return { username };
};

export const getRepoCodeQuality = async (username, repo) => {
  try {
    const repoData = await octokit.repos.get({
      owner: username,
      repo,
    });

    const hasReadme = repoData.data.has_downloads || (await _checkFileExists(username, repo, 'README.md'));
    const hasLicense = repoData.data.license ? true : false;
    const licenseType = repoData.data.license?.name || null;
    const topics = repoData.data.topics || [];
    const hasTopics = topics.length > 0;
    const hasTests = await _checkFolderExists(username, repo, 'test') || (await _checkFolderExists(username, repo, 'tests')) || (await _checkFolderExists(username, repo, '__tests__'));

    const qualityScore = _calculateQualityScore({
      hasReadme,
      hasLicense,
      hasTopics,
      hasTests,
    });

    return {
      repo,
      hasReadme,
      hasLicense,
      licenseType,
      topics,
      hasTopics,
      hasTests,
      qualityScore,
    };
  } catch (error) {
    return {
      repo,
      error: error.message,
      qualityScore: 0,
    };
  }
};

export const getUserReposQuality = async (username) => {
  try {
    const repos = await octokit.paginate(octokit.repos.listForUser, {
      username,
      per_page: 100,
    });

    const qualityReports = await Promise.all(
      repos.map((repo) => getRepoCodeQuality(username, repo.name))
    );

    const averageScore = qualityReports.reduce((sum, r) => sum + (r.qualityScore || 0), 0) / (qualityReports.length || 1);
    const topRepos = qualityReports.sort((a, b) => (b.qualityScore || 0) - (a.qualityScore || 0)).slice(0, 5);

    return {
      username,
      totalRepos: qualityReports.length,
      averageQualityScore: Math.round(averageScore * 100) / 100,
      topRepos,
      allRepos: qualityReports,
    };
  } catch (error) {
    return {
      error: error.message,
      username,
    };
  }
};

const _checkFileExists = async (owner, repo, filename) => {
  try {
    await octokit.repos.getContent({
      owner,
      repo,
      path: filename,
    });
    return true;
  } catch (error) {
    return false;
  }
};

const _checkFolderExists = async (owner, repo, folderName) => {
  try {
    const content = await octokit.repos.getContent({
      owner,
      repo,
      path: folderName,
    });
    return Array.isArray(content.data);
  } catch (error) {
    return false;
  }
};

const _calculateQualityScore = (checks) => {
  let score = 0;
  if (checks.hasReadme) score += 25;
  if (checks.hasLicense) score += 25;
  if (checks.hasTopics) score += 25;
  if (checks.hasTests) score += 25;
  return score;
};
