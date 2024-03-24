import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import BoxWithShadow from './BoxWithShadow'; // Assuming you have exported it from the file above

interface IDonor {
  _id: string;
  contact_name: string;
  contact_email: string;
  contact_address: string;
  contact_phone: string;
  donor_group: string;
  registered_date: Date;
  last_donation_date: Date;
  last_communication_date: Date;
  type: string;
  comments: string;
}

interface ProfileInfoProps {
  donatorData: IDonor | null;
}

function ProfileInfo({ donatorData }: ProfileInfoProps) {
  return (
    <BoxWithShadow>
      <Typography variant="h4" gutterBottom>
        {donatorData?.contact_name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {donatorData?.type}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Email address: {donatorData?.contact_email}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Phone number: {donatorData?.contact_phone}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Address: {donatorData?.contact_address}
      </Typography>
    </BoxWithShadow>
  );
}

export default ProfileInfo;
