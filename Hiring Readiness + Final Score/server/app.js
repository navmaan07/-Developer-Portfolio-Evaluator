
import express from 'express';
import { score } from './services/scoringService.js';

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', day: 8 }));

app.get('/api/score', (req, res) => {
  try {
    const result = score(req.query);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/score', (req, res) => {
  try {
    const result = score(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(5000, () => console.log('Server running'));

