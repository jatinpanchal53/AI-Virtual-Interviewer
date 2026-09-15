import { Router } from 'express';
import { interviewController } from '../controllers/interviewController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Public interview routes (no auth)
// router.use(authenticate); // removed for public access

router.post('/', (req, res, next) => interviewController.createInterview(req, res, next));
router.get('/', (req, res, next) => interviewController.getUserInterviews(req, res, next));
router.get('/:interviewId', (req, res, next) => interviewController.getInterviewById(req, res, next));

router.post('/:interviewId/start', (req, res, next) => interviewController.startInterview(req, res, next));
router.get('/:interviewId/current-question', (req, res, next) => interviewController.getCurrentQuestion(req, res, next));
router.post('/:interviewId/answers', (req, res, next) => interviewController.submitAnswer(req, res, next));
router.get('/:interviewId/results', (req, res, next) => interviewController.getResults(req, res, next));

export default router;
