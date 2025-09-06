import { urlModel } from '../models/urlModel.js';
import { isValidShortcode } from '../utils/generateShortcode.js';

export const createShortUrl = async (req, res) => {
  const { logger } = req;
  
  try {
    const { url, validity = 30, shortcode } = req.body;

    // Validate URL (basic)
    try {
      new URL(url);
    } catch {
      logger.warn('Invalid URL format provided');
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Validate validity
    if (validity && (!Number.isInteger(validity) || validity <= 0)) {
      logger.warn('Invalid validity value');
      return res.status(400).json({ error: 'Validity must be a positive integer' });
    }

    // Validate custom shortcode
    if (shortcode && !isValidShortcode(shortcode)) {
      logger.warn('Invalid shortcode format');
      return res.status(400).json({ error: 'Shortcode must be alphanumeric, 4-10 characters' });
    }

    const result = await urlModel.create(url, validity, shortcode);

    logger.info(`Short URL created: ${result.shortLink}`);
    res.status(201).json(result);

  } catch (error) {
    logger.error('Failed to create short URL', { error: error.message });
    if (error.message.includes('already taken')) {
      return res.status(409).json({ error: 'Shortcode already taken' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getStats = async (req, res) => {
  const { logger } = req;
  const { shortcode } = req.params;

  try {
    const stats = await urlModel.getStats(shortcode);
    if (!stats) {
      logger.warn(`Stats requested for non-existent shortcode: ${shortcode}`);
      return res.status(404).json({ error: 'Shortcode not found' });
    }

    logger.info(`Stats retrieved for: ${shortcode}`);
    res.json(stats);

  } catch (error) {
    logger.error(`Failed to retrieve stats for ${shortcode}`, { error: error.message });
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllStats = async (req, res) => {
  const { logger } = req;

  try {
    const allStats = await urlModel.getAllStats();
    logger.info(`Retrieved stats for ${allStats.length} short URLs`);
    res.json(allStats);
  } catch (error) {
    logger.error('Failed to retrieve all stats', { error: error.message });
    res.status(500).json({ error: 'Internal Server Error' });
  }
};