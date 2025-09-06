import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar';
import ShortenerPage from './pages/ShortenerPage';
import StatsPage from './pages/StatsPage';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 1, mb: 1, flex: 1 }}>
        <Routes>
          <Route path="/" element={<ShortenerPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;