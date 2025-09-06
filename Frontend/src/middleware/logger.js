// MANDATORY CUSTOM LOGGER — NO console.log ALLOWED

class FrontendLogger {
  constructor() {
    this.logLevel = process.env.REACT_APP_LOG_LEVEL || 'INFO';
    this.levels = { ERROR: 0, WARN: 1, INFO: 2, DEBUG: 3 };
  }

  log(level, message, meta = {}) {
    if (this.levels[level] <= this.levels[this.logLevel]) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...meta
      };
      // In real app, send to backend logging endpoint
      // For now, we simulate by storing in localStorage or sending to /log
      localStorage.setItem('lastLog', JSON.stringify(logEntry));
    }
  }

  error(message, meta) { this.log('ERROR', message, meta); }
  warn(message, meta) { this.log('WARN', message, meta); }
  info(message, meta) { this.log('INFO', message, meta); }
  debug(message, meta) { this.log('DEBUG', message, meta); }
}

const logger = new FrontendLogger();
export default logger;