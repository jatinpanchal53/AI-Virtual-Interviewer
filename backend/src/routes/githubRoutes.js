import { Router } from 'express';
import { githubController } from '../controllers/githubController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Allow authenticated users to analyze repos
router.post('/analyze', authenticate, (req, res, next) => githubController.analyze(req, res, next));

export default router;
