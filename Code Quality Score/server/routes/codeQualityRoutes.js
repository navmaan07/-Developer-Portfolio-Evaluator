import express from 'express';
import * as codeQualityController from '../controllers/codeQualityController.js';

const router = express.Router();

router.get('/quality/:username/:repo', codeQualityController.getRepoQuality);
router.get('/quality/:username', codeQualityController.getUserReposQuality);

export default router;
