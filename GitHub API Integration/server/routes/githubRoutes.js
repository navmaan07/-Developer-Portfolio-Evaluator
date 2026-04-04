import express from 'express';
import githubController from '../controllers/githubController.js';

const router = express.Router();

router.get('/user/:username', githubController.getUserProfile);
router.get('/repos/:username', githubController.getUserRepos);

export default router;