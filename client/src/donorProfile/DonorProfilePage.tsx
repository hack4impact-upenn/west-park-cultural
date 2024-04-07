import React from 'react';
import { Box, Button } from '@mui/material';
import ProfileInfo from './ProfileInfo'; // Adjust the import path as needed
import DateInfoBox from './DateInfoBox'; // Adjust the import path as needed
import DonationsSponsorshipsTable from '../components/tables/DonationsTable';

//begin integration
interface DonorProfileProps {
  donorID: string;
}

function DonorProfilePage({donorID}: DonorProfileProps) {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <ProfileInfo />
        <DateInfoBox />
      </Box>

      {/* Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="contained" sx={{ mr: 1 }}>
          Edit Profile
        </Button>
        <Button variant="contained" color="primary">
          Message
        </Button>
      </Box>

      {/* Placeholder for Donation History Table */}
      {/* <Box
        sx={{
          height: 300,
          bgcolor: '#e0e0e0',
          borderRadius: 2,
          boxShadow: 3,
        }}
      > */}
        {/* <DonationsSponsorshipsTable donorID={donorID}/> */}
        {/* Donation history will go here */}
    </Box>
  );
}

export default DonorProfilePage;
