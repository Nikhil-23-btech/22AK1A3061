import { Router } from 'express';
import { createShortUrl, getStats, getAllStats } from '../controllers/urlController.js';

const router = Router();

// POST /shorturls — Create new short URL
router.post('/', createShortUrl);

// GET /shorturls/:shortcode — Get stats for specific shortcode
router.get('/:shortcode', getStats);

// GET /shorturls — Get all stats (for frontend listing)
router.get('/', getAllStats);

export default router;