import * as githubService from '../services/githubService.js';

export const getRepoQuality = async (req, res) => {
  try {
    const { username, repo } = req.params;
    const quality = await githubService.getRepoCodeQuality(username, repo);
    res.json(quality);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserReposQuality = async (req, res) => {
  try {
    const { username } = req.params;
    const quality = await githubService.getUserReposQuality(username);
    res.json(quality);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
