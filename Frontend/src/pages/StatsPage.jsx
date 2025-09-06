import React, { useEffect, useState } from 'react';
import { Typography, Box, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import UrlStatsCard from '../components/UrlStatsCard';
import logger from '../middleware/logger';

const StatsPage = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      logger.info('Fetching all URL statistics');

      try {
        const response = await axios.get('http://localhost:5000/shorturls');
        setStats(response.data);
        logger.info(`Fetched stats for ${response.data.length} URLs`);
      } catch (err) {
        setError('Failed to load statistics. Ensure backend is running.');
        logger.error('Failed to fetch stats', { error: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        📊 URL Statistics Dashboard
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
        View analytics for all shortened URLs including click locations and sources.
      </Typography>

      {stats.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No shortened URLs found. Create some first!
        </Typography>
      ) : (
        stats.map(stat => (
          <UrlStatsCard key={stat.shortcode} stat={stat} />
        ))
      )}
    </Box>
  );
};

export default StatsPage;