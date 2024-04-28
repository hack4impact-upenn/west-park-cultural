import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import BoxWithShadow from './BoxWithShadow'; // Assuming you have exported it from the file above

function ProfileInfo() {
  return (
    <BoxWithShadow>
      <Typography variant="h4" gutterBottom>
        John Smith
      </Typography>
      <Typography variant="body1" gutterBottom>
        .Individual
      </Typography>
      <Typography variant="body1" gutterBottom>
        Email address: lsyslc0307@gmail.com
      </Typography>
      <Typography variant="body1" gutterBottom>
        Phone number: 609-297-6873
      </Typography>
      <Typography variant="body1" gutterBottom>
        Address: Spruce street, 19104
      </Typography>
    </BoxWithShadow>
  );
}

export default ProfileInfo;
