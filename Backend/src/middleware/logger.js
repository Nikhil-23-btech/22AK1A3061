import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDir = path.join(__dirname, '../../logs');
const logFile = path.join(logDir, 'app.log');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
const levels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};
const currentLevel = process.env.LOG_LEVEL ? levels[process.env.LOG_LEVEL] : levels.INFO;
function writeLog(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = JSON.stringify({
    timestamp,
    level,
    message,
    ...meta,
    stack: meta.stack || null
  });
  fs.appendFileSync(logFile, logEntry + '\n', 'utf8');
}
function createLogger(reqId) {
  return {
    error: (message, meta = {}) => {
      if (currentLevel >= levels.ERROR) writeLog('ERROR', message, { reqId, ...meta });
    },
    warn: (message, meta = {}) => {
      if (currentLevel >= levels.WARN) writeLog('WARN', message, { reqId, ...meta });
    },
    info: (message, meta = {}) => {
      if (currentLevel >= levels.INFO) writeLog('INFO', message, { reqId, ...meta });
    },
    debug: (message, meta = {}) => {
      if (currentLevel >= levels.DEBUG) writeLog('DEBUG', message, { reqId, ...meta });
    }
  };
}
const loggerMiddleware = (req, res, next) => {
  const reqId = Math.random().toString(36).substring(2, 15);
  req.logger = createLogger(reqId);
  req.logger.info('Incoming Request', {
    method: req.method,
    url: req.url,
    ip: req.ip
  });
  res.on('finish', () => {
    req.logger.info('Request Completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: Date.now() - req._startTime
    });
  });
  req._startTime = Date.now();
  next();
};


export default loggerMiddleware;
