import { Router } from 'express';
import { roleController } from '../controllers/roleController.js';

const router = Router();

router.get('/', (req, res) => roleController.getRoles(req, res));

export default router;
