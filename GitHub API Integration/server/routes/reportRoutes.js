import express from 'express';
import reportController from '../controllers/reportController.js';

const router = express.Router();

router.post('/reports', reportController.createReport);
router.get('/reports', reportController.getReports);

export default router;