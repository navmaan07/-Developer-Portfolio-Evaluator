
import express from 'express';
import dotenv from 'dotenv';
import healthRoutes from './routes/healthRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

// Mount routes
app.use('/api/health', healthRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
