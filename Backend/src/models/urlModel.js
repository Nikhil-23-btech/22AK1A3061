// backend/src/models/urlModel.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dayjs from 'dayjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../../data/database.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(dataPath))) {
  fs.mkdirSync(path.dirname(dataPath), { recursive: true });
}

// Initialize DB file if not exists
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, JSON.stringify({ urls: [] }, null, 2), 'utf8');
}

class UrlModel {
  constructor() {
    this.load();
  }

  load() {
    try {
      const rawData = fs.readFileSync(dataPath, 'utf8');
      this.data = JSON.parse(rawData);
      if (!Array.isArray(this.data.urls)) {
        this.data.urls = [];
      }
    } catch (err) {
      console.error('⚠️ Failed to load database, resetting:', err.message);
      this.data = { urls: [] };
    }
  }

  save() {
    try {
      fs.writeFileSync(dataPath, JSON.stringify(this.data, null, 2), 'utf8');
      console.log('✅ Database saved successfully:', this.data.urls.length, 'records');
    } catch (err) {
      console.error('❌ FAILED to save database:', err.message);
      throw new Error('Database write failed: ' + err.message);
    }
  }

  async create(originalUrl, validityMinutes = 30, customShortcode = null) {
    let shortcode = customShortcode;

    if (shortcode) {
      if (!this.isValidShortcode(shortcode)) {
        throw new Error('Invalid shortcode format');
      }
      if (this.data.urls.some(u => u.shortcode === shortcode)) {
        throw new Error('Shortcode already taken');
      }
    } else {
      // Generate unique shortcode
      let attempts = 0;
      do {
        shortcode = this.generateShortcode();
        attempts++;
        if (attempts > 10) throw new Error('Failed to generate unique shortcode');
      } while (this.data.urls.some(u => u.shortcode === shortcode));
    }

    const expiry = dayjs().add(validityMinutes, 'minute').toISOString();
    const newUrl = {
      shortcode,
      originalUrl,
      expiry,
      createdAt: new Date().toISOString(),
      clicks: []
    };

    this.data.urls.push(newUrl);
    
    // 💥 CRITICAL: Save to disk BEFORE returning response
    this.save();

    return {
      shortLink: `http://localhost:5000/${shortcode}`,
      expiry
    };
  }

  async findByShortcode(shortcode) {
    return this.data.urls.find(u => u.shortcode === shortcode) || null;
  }

  async logClick(shortcode, clickData) {
    const record = this.data.urls.find(u => u.shortcode === shortcode);
    if (record) {
      record.clicks.push(clickData);
      this.save(); // Save click log
    }
  }

  async getStats(shortcode) {
    const record = await this.findByShortcode(shortcode);
    if (!record) return null;

    return {
      shortcode,
      originalUrl: record.originalUrl,
      createdAt: record.createdAt,
      expiry: record.expiry,
      totalClicks: record.clicks.length,
      clicks: record.clicks
    };
  }

  async getAllStats() {
    return this.data.urls.map(url => ({
      shortcode: url.shortcode,
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
      expiry: url.expiry,
      totalClicks: url.clicks.length,
      clicks: url.clicks
    }));
  }

  generateShortcode() {
    return Math.random().toString(36).substring(2, 8);
  }

  isValidShortcode(code) {
    if (!code || typeof code !== 'string') return false;
    if (code.length < 4 || code.length > 10) return false;
    return /^[a-zA-Z0-9]+$/.test(code);
  }
}

export const urlModel = new UrlModel();