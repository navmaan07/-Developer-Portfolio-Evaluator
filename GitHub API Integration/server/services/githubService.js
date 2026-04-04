
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

dotenv.config();

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const getUserProfile = async (username) => {
  const { data } = await octokit.users.getByUsername({ username });
  return data;
};

const getUserRepos = async (username) => {
  const { data } = await octokit.repos.listForUser({ username });
  return data;
};

export default { getUserProfile, getUserRepos };
