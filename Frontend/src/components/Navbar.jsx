import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import logger from '../middleware/logger';
const Navbar = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          URL Shortening
        </Typography>
        <Box>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            onClick={() => logger.info('Navigated to Shortener Page')}
          >
            Shorten URLs
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/stats"
            onClick={() => logger.info('Navigated to Stats Page')}
          >
            Statistics
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default Navbar;