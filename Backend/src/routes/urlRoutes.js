import { Router } from 'express';
import { createShortUrl, getStats, getAllStats } from '../controllers/urlController.js';
const router = Router();
router.post('/', createShortUrl);
router.get('/:shortcode', getStats);
router.get('/', getAllStats);
export default router;
