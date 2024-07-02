/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import DonorsTable from '../components/tables/DonorsTable';
import '../HomeDashboard/homedashboard.css';

function DonationDahsboard() {
  const [alignment, setalignment] = useState('donation');

  function getHeader() {
    if (alignment === 'donation') {
      return 'Donors';
    }
    if (alignment === 'sponsorship') {
      return 'Sponsors';
    }
    if (alignment === 'grant') {
      return 'Grants';
    }
    return '';
  }
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    if (newAlignment) {
      setalignment(newAlignment);
    }
  };

  return (
    <div className="max-width-wrapper">
      <div style={{}}>
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleChange}
          style={{ marginTop: '16px', marginRight: '8px' }}
          fullWidth
        >
          <ToggleButton value="donation">Donation</ToggleButton>
          <ToggleButton value="sponsorship">Sponsorship</ToggleButton>
          <ToggleButton value="grant">Grant</ToggleButton>
        </ToggleButtonGroup>

        <div style={{ marginTop: '32px' }}>
          <Typography variant="h4" gutterBottom>
            {getHeader()}
          </Typography>

          <DonorsTable alignment={alignment} />
        </div>
      </div>
    </div>
  );
}

export default DonationDahsboard;
