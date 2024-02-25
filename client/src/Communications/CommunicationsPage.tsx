/* eslint-disable no-alert */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';

import {
  Typography,
  Grid,
  TextField,
  Autocomplete,
  Button,
  Stack,
} from '@mui/material';

const testData = [
  {
    _id: '23gds',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  },
  {
    _id: '35sga',
    firstName: 'Lucy',
    lastName: 'Kim',
    email: 'lucy.kim@example.com',
  },
];

const testDataGroup = [
  { "_id": "93mnd",
    "groupName": "group1",
    "donors": [
      { "_id": '35adf',
        "contact_name": "James Li",
        "contact_email": "james.li@example.com"},
      { "_id": '35sga', 
        "contact_name": "Lucy Kim",
        "contact_email": "lucy.kim@example.com"},
      { "_id": '93dga', 
        "contact_name": "Liza Webster",
        "contact_email": "liza.webster@example.com"}]
  },
  { "_id": "92nwf",
    "groupName": "group2",
    "donors": [
      { "_id": '35adf',
        "contact_name": "Sam Huh",
        "contact_email": "sam.huh.li@example.com"},
      { "_id": '25agd', 
        "contact_name": "Lany Shah",
        "contact_email": "lany.Shah@example.com"}]
  }];

const notTest = [
  'user3',
  'user2',
  'user1',
];
  
function CommunicationsPage() {
  return (
    <div>
      <Grid container sx={{ m: 3 }} spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
            Communications
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">
            Send emails to individual users, groups of individuals, and mailing
            lists. Clicking the “email” button, will open a popup with the
            respective emails, which you can then copy and paste into your email
            application (i.e. Gmail or Outlook)
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Individual Person
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={notTest}
            sx={{ width: 300 }}
            renderInput={(params) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <TextField {...params} label="Search Name" />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Groups
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              alert('generate new report clicked');
            }}
          >
            Email Unacknowledged Donations
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              alert('generate new report clicked');
            }}
          >
            Search All Donors & Sponsors
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row">
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={notTest}
              sx={{ width: 300 }}
              renderInput={(params) => (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <TextField {...params} label="Search Name" />
              )}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                alert('generate new report clicked');
              }}
            >
              Add Group
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Emails
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="inherit"
            onClick={() => {
              alert('generate new report clicked');
            }}
          >
            Clear
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              alert('generate new report clicked');
            }}
          >
            Copy All Emails
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default CommunicationsPage;
