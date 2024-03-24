import React from 'react';
import { Box, Typography } from '@mui/material';
import BoxWithShadow from './BoxWithShadow'; // Assuming you have exported it from the file above

interface IDonor {
  _id: string;
  contact_name: string;
  contact_email: string;
  contact_address: string;
  contact_phone: string;
  donor_group: string;
  registered_date: Date | null;
  last_donation_date: Date | null;
  last_communication_date: Date | null;
  type: string;
  comments: string;
}

interface ProfileInfoProps {
  donatorData: IDonor | null;
}

function DateInfoBox({ donatorData }: ProfileInfoProps) {
  return (
    <BoxWithShadow>
      <Typography variant="body1" gutterBottom>
        REGISTERED DATE
      </Typography>
      <Typography variant="body1" gutterBottom>
        {donatorData?.registered_date?.toLocaleString()}
      </Typography>
      <Typography variant="body1" gutterBottom>
        RECENT DONATION
      </Typography>
      <Typography variant="body1" gutterBottom>
        {donatorData?.last_donation_date?.toLocaleString()}
      </Typography>
      <Typography variant="body1" gutterBottom>
        LAST COMMUNICATION
      </Typography>
      <Typography variant="body1" gutterBottom>
        {donatorData?.last_communication_date?.toLocaleString()}
      </Typography>
    </BoxWithShadow>
  );
}

export default DateInfoBox;
