import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Authentication routes removed for public access
import roleRoutes from './routes/roleRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import repoRoutes from './routes/repo.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) =>
  res.status(200).json({
    success: true,
    data: {
      status: 'UP',
      timestamp: new Date().toISOString(),
      service: 'AI Virtual Interviewer Backend'
    }
  }));

// API Routes (public)
// app.use('/api/auth', authRoutes); // removed
app.use('/api/roles', roleRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/repo', repoRoutes);

// Centralized Error Handling
app.use(errorHandler);

export default app;
