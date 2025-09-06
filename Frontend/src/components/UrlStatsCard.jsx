import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Box
} from '@mui/material';

const UrlStatsCard = ({ stat }) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {stat.shortcode}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Original: <a href={stat.originalUrl} target="_blank" rel="noreferrer">{stat.originalUrl}</a>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Created: {new Date(stat.createdAt).toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Expires: {new Date(stat.expiry).toLocaleString()}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip label={`${stat.totalClicks} Clicks`} color="primary" />
        </Box>

        {stat.clicks.length > 0 && (
          <>
            <Typography variant="subtitle1" gutterBottom>Click Details:</Typography>
            <List dense>
              {stat.clicks.map((click, idx) => (
                <ListItem key={idx} divider={idx < stat.clicks.length - 1}>
                  <ListItemText
                    primary={new Date(click.timestamp).toLocaleString()}
                    secondary={
                      <>
                        <div>Referrer: {click.referrer}</div>
                        <div>Location: {click.geo?.country || 'Unknown'}, {click.geo?.region || 'Unknown'}</div>
                        <div>IP: {click.ip}</div>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UrlStatsCard;