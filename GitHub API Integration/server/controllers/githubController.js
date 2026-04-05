import githubService from '../services/githubService.js';

const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const profile = await githubService.getUserProfile(username);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserRepos = async (req, res) => {
  try {
    const { username } = req.params;
    const repos = await githubService.getUserRepos(username);
    res.json(repos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserActivity = async (req, res) => {
  try {
    const { username } = req.params;
    const activity = await githubService.getUserActivity(username);
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default { getUserProfile, getUserRepos, getUserActivity };