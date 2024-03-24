import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import ProfileInfo from './ProfileInfo'; // Adjust the import path as needed
import DateInfoBox from './DateInfoBox'; // Adjust the import path as needed
import { useData } from '../util/api';

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

function DonorProfilePage() {
  const { donatorId } = useParams();

  const donator = useData(`donor/id/${donatorId}`);
  const [donatorData, setDonatorData] = useState<IDonor | null>(null);
  useEffect(() => {
    const data = donator?.data || null;
    setDonatorData(data);
  }, [donator]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <ProfileInfo donatorData={donatorData} />
        <DateInfoBox donatorData={donatorData} />
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
      <Box
        sx={{
          height: 300,
          bgcolor: '#e0e0e0',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        {/* Donation history will go here */}
      </Box>
    </Box>
  );
}

export default DonorProfilePage;
