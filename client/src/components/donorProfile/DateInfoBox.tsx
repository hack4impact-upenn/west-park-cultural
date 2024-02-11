import React from 'react';
import { Box, Typography } from '@mui/material';
import BoxWithShadow from './BoxWithShadow'; // Assuming you have exported it from the file above

function DateInfoBox() {
  return (
    <BoxWithShadow>
      <Typography variant="body1" gutterBottom>
        REGISTERED DATE
      </Typography>
      <Typography variant="body1" gutterBottom>
        09/05/2023
      </Typography>
      <Typography variant="body1" gutterBottom>
        RECENT DONATION
      </Typography>
      <Typography variant="body1" gutterBottom>
        10/30/2023
      </Typography>
      <Typography variant="body1" gutterBottom>
        LAST COMMUNICATION
      </Typography>
      <Typography variant="body1" gutterBottom>
        11/02/2023
      </Typography>
    </BoxWithShadow>
  );
}

export default DateInfoBox;
