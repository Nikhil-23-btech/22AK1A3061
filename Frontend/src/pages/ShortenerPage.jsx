import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';
import UrlShortenerForm from '../components/UrlShortenerForm';
import logger from '../middleware/logger';

const ShortenerPage = () => {
  const [results, setResults] = useState(Array(5).fill(null));

  const handleShortenSuccess = (result, index) => {
    const newResults = [...results];
    newResults[index] = result;
    setResults(newResults);
    logger.info(`Short URL #${index + 1} result stored in state`);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        🚀 Bulk URL Shortener
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
        Shorten up to 5 URLs at once. Each can have custom validity and shortcode.
      </Typography>

      {[0, 1, 2, 3, 4].map(i => (
        <UrlShortenerForm
          key={i}
          index={i}
          onShortenSuccess={handleShortenSuccess}
        />
      ))}
    </Box>
  );
};

export default ShortenerPage;