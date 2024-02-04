import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Typography, Grid } from '@mui/material';
import ScreenGrid from '../components/ScreenGrid';

/**
 The New Donation Page
 */
function NewDonationPage() {
  return (
    <ScreenGrid>
      <Typography variant="h2">New Donation Form Page</Typography>
      {/* <Grid item container justifyContent="center">
        <PromoteButton
          admin={admin}
          handleSelfPromote={handleSelfPromote}
          navigator={navigator}
        />
      </Grid>
      <Grid item container justifyContent="center">
        <Button onClick={handleLogout}>Logout</Button>
      </Grid> */}
    </ScreenGrid>
  );
}

export default NewDonationPage;
