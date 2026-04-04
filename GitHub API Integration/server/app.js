
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import healthRoutes from './routes/healthRoutes.js';
import githubRoutes from './routes/githubRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', healthRoutes);
app.use('/api/github', githubRoutes);
app.use('/api', reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
