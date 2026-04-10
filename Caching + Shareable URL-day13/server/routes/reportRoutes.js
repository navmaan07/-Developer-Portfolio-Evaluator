import express from 'express';
import Report from '../models/Report.js';

const router = express.Router();

// GET /api/reports/:username - Get cached report by username
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;

    // Try to find existing cached report
    let report = await Report.findOne({ username }).sort({ createdAt: -1 });

    if (report) {
      return res.json({
        cached: true,
        data: report,
        expiresAt: new Date(report.createdAt.getTime() + 24 * 60 * 60 * 1000)
      });
    }

    // If no cached report, return 404
    res.status(404).json({
      error: 'Report not found',
      message: `No cached report found for username: ${username}. Reports are cached for 24 hours.`
    });

  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/reports - Create new report (for caching)
router.post('/', async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();

    res.status(201).json({
      message: 'Report cached successfully',
      data: report,
      expiresAt: new Date(report.createdAt.getTime() + 24 * 60 * 60 * 1000)
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Failed to cache report' });
  }
});

// GET /api/reports - Get all cached reports (admin/debug endpoint)
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

export default router;
