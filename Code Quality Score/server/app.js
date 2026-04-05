
import express from 'express';
import codeQualityRoutes from './routes/codeQualityRoutes.js';

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', day: 6 }));
app.use('/api', codeQualityRoutes);

app.listen(5000, () => console.log('Server running'));

export default app;
