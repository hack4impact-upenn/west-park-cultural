import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import BoxWithShadow from './BoxWithShadow'; // Assuming you have exported it from the file above
import IDonor from '../util/types/donor';

interface ProfileInfoProps {
  donatorData: IDonor | null;
}

function ProfileInfo({ donatorData }: ProfileInfoProps) {
  return (
    <Box
      sx={{
        maxWidth: 400,
        maxHeight: 300,
        overflow: 'auto',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        borderRadius: 2,
        p: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        {donatorData?.contact_name}
      </Typography>
      <Typography
        variant="body1"
        sx={{ fontWeight: 600, color: 'grey' }}
        gutterBottom
      >
        {donatorData?.donor_group}
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
      {donatorData?.donor_group !== 'Individual' &&
      donatorData?.donor_group !== 'Board Member' ? (
        <>
          <Typography variant="body1" gutterBottom>
            Org Name: {donatorData?.org_name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Org Email: {donatorData?.org_email}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Org Address: {donatorData?.org_address}
          </Typography>
        </>
      ) : null}
    </Box>
  );
}

export default ProfileInfo;
