import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import loggerMiddleware from './src/middleware/logger.js';
import urlRoutes from './src/routes/urlRoutes.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined', {
  stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
}));
app.use(loggerMiddleware);
app.use('/shorturls', urlRoutes);
app.get('/:shortcode', async (req, res) => {
  const { logger } = req;
  const { shortcode } = req.params;

  try {
    const urlData = await global.urlModel.findByShortcode(shortcode);
    if (!urlData) {
      logger.warn(`Shortcode not found: ${shortcode}`);
      return res.status(404).json({ error: 'Shortcode not found' });
    }
    if (new Date() > new Date(urlData.expiry)) {
      logger.warn(`Expired shortcode accessed: ${shortcode}`);
      return res.status(410).json({ error: 'Link expired' }); 
    }
    const clickData = {
      timestamp: new Date().toISOString(),
      referrer: req.get('Referrer') || req.get('Referer') || 'direct',
      ip: req.ip || req.connection.remoteAddress || 'unknown',
      geo: getGeoFromIp(req.ip || req.connection.remoteAddress)
    };
    await global.urlModel.logClick(shortcode, clickData);
    logger.info(`Redirecting ${shortcode} to ${urlData.originalUrl}`);
    res.redirect(302, urlData.originalUrl);

  } catch (error) {
    logger.error(`Redirection error for ${shortcode}: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
function getGeoFromIp(ip) {
  // Handle localhost/dev
  if (!ip || ip === '::1' || ip === '127.0.0.1' || ip === 'unknown') {
    return { country: 'Local', region: 'Dev' };
  }

  try {
    const geo = global.geoip.lookup(ip);
    if (geo && geo.country) {
      return {
        country: geo.country,    
        region: geo.region || 'N/A' 
      };
    } else {
      return { country: 'Unknown', region: 'Unknown' };
    }
  } catch (err) {
    return { country: 'Unknown', region: 'Unknown' };
  }
}
try {
  const { urlModel } = await import('./src/models/urlModel.js');
  global.urlModel = urlModel;
  global.geoip = await import('geoip-lite');
} catch (err) {
  console.error('❌ Failed to initialize models:', err.message);
  process.exit(1); // Exit if critical init fails
}
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});
app.listen(PORT, () => {
  console.log(`🚀 URL Shortener Microservice running on http://localhost:${PORT}`);
  console.log(`🔗 Create short URLs: POST http://localhost:${PORT}/shorturls`);
  console.log(`📊 View stats: GET http://localhost:${PORT}/shorturls/{shortcode}`);
  console.log(`🔄 Redirect: Visit http://localhost:${PORT}/{shortcode}`);

});
