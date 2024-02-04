import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Typography, Grid, TextField } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ScreenGrid from '../components/ScreenGrid';
import FormGrid from '../components/form/FormGrid';

/**
 The New Donation Page
 */
function NewDonationPage() {
  const [donationType, setDonationType] = React.useState<string | null>(
    'donation',
  );

  const handleDonationType = (
    event: React.MouseEvent<HTMLElement>,
    newDonationType: string | null,
  ) => {
    setDonationType(newDonationType);
  };

  return (
    <Grid container sx={{ m: 3 }} spacing={2}>
      <Grid item>
        <Typography variant="h2">Register New Donation</Typography>
      </Grid>
      <Grid item xs={12}>
        <ToggleButtonGroup
          value={donationType}
          exclusive
          onChange={handleDonationType}
          aria-label="donation type"
          size="large"
        >
          <ToggleButton value="donation" aria-label="donation">
            Donation
          </ToggleButton>
          <ToggleButton value="sponsorship" aria-label="sponsorship">
            Sponsorship
          </ToggleButton>
          <ToggleButton value="grant" aria-label="grant">
            Grant
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid item>
        <TextField
          id="outlined-basic"
          label="Donation Amount"
          variant="outlined"
          required
        />
      </Grid>
    </Grid>
  );
}

export default NewDonationPage;
