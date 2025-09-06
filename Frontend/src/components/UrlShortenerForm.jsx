import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import logger from '../middleware/logger';

const UrlShortenerForm = ({ onShortenSuccess, index }) => {
  const [url, setUrl] = useState('');
  const [validity, setValidity] = useState(30);
  const [shortcode, setShortcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const validateUrl = (str) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!url.trim()) {
      setError('URL is required');
      return;
    }
    if (!validateUrl(url)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }
    if (validity && (!Number.isInteger(Number(validity)) || Number(validity) <= 0)) {
      setError('Validity must be a positive integer');
      return;
    }
    if (shortcode && (shortcode.length < 4 || shortcode.length > 10 || !/^[a-zA-Z0-9]+$/.test(shortcode))) {
      setError('Shortcode must be alphanumeric, 4-10 characters');
      return;
    }
    setLoading(true);
    logger.info(`Submitting URL shortening request #${index + 1}`);
    try {
      const response = await axios.post('http://localhost:5000/shorturls', {
        url,
        validity: Number(validity) || 30,
        shortcode: shortcode || undefined
      });
      setResult(response.data);
      onShortenSuccess(response.data, index);
      logger.info(`Short URL created successfully for #${index + 1}: ${response.data.shortLink}`);
    } catch (err) {
      let msg = 'Failed to create short URL';
      if (err.response?.status === 409) {
        msg = 'Shortcode already taken. Try another.';
      } else if (err.response?.status === 400) {
        msg = err.response.data.error;
      }
      setError(msg);
      logger.error(`Shorten failed for #${index + 1}`, { error: err.message });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          URL #{index + 1}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {result && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <strong>Short Link:</strong> <a href={result.shortLink} target="_blank" rel="noreferrer">{result.shortLink}</a><br />
            <strong>Expires:</strong> {new Date(result.expiry).toLocaleString()}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Original URL"
                variant="outlined"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Validity (minutes)"
                type="number"
                value={validity}
                onChange={(e) => setValidity(e.target.value)}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Custom Shortcode (optional)"
                value={shortcode}
                onChange={(e) => setShortcode(e.target.value)}
                placeholder="e.g. mylink"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Shorten URL'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default UrlShortenerForm;