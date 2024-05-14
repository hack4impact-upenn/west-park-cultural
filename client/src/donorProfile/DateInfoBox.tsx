import React from 'react';
import { Box, Typography } from '@mui/material';
import BoxWithShadow from './BoxWithShadow'; // Assuming you have exported it from the file above
import IDonor from '../util/types/donor';

interface ProfileInfoProps {
  donatorData: IDonor | null;
}

function DateInfoBox({ donatorData }: ProfileInfoProps) {
  const formatDate = (time: Date | undefined | null | string): string => {
    if (time instanceof Date) {
      const year = time.getFullYear().toString();
      const month = (time.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed, so add 1
      const day = time.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    } if (typeof time === 'string') {
      const date = new Date(time);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed, so add 1
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return '';
  };
  
  return (
    <Box
      sx={{
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        borderRadius: 2,
        p: 2,
      }}
    >
      <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Registered Date
      </Typography>
      <Typography variant="body1" gutterBottom>
        {formatDate(donatorData?.registered_date)}
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Recent Donation
      </Typography>
      <Typography variant="body1" gutterBottom>
        {formatDate(donatorData?.last_donation_date)}
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Last Communication
      </Typography>
      <Typography variant="body1" gutterBottom>
        {formatDate(donatorData?.last_communication_date)}
      </Typography>
    </Box>
  );
}

export default DateInfoBox;
