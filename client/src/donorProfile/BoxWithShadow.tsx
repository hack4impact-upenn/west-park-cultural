import React from 'react';
import { Box, Typography } from '@mui/material';

interface BoxWithShadowProps {
  title?: string;
  children?: React.ReactNode;
}

function BoxWithShadow({ title, children }: BoxWithShadowProps) {
  return (
    <Box
      sx={{
        boxShadow: 3,
        borderRadius: 2,
        p: 2,
        mb: 2,
        bgcolor: 'background.paper',
      }}
    >
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      {children}
    </Box>
  );
}

export default BoxWithShadow;
