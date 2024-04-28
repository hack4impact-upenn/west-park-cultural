/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem, Popover, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import ProfileInfo from './ProfileInfo';
import DateInfoBox from './DateInfoBox';
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [orgName, setOrgName] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [orgAddress, setOrgAddress] = useState('');
  const [selectedDonorGroup, setSelectedDonorGroup] = useState('');
  const [selectedDonorType, setSelectedDonorType] = useState('');
  const [confirmDisabled, setConfirmDisabled] = useState(true);
  const { donatorId } = useParams();

  const donator = useData(`donor/id/${donatorId}`);
  const [donatorData, setDonatorData] = useState<IDonor | null>(null);

  useEffect(() => {
    const data = donator?.data || null;
    setDonatorData(data);
  }, [donator]);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setOrgName('');
    setOrgEmail('');
    setOrgAddress('');
    setSelectedDonorGroup('');
    setSelectedDonorType('');
    setConfirmDisabled(true); // Reset confirm button state
  };

  const handleConfirm = () => {
    // update donor
    handleClose(); // Close the popover after confirming changes
  };

  const isFormValid = () => {
    return (
      name !== '' &&
      email !== '' &&
      phone !== '' &&
      address !== '' &&
      selectedDonorGroup !== '' &&
      selectedDonorType !== ''
    );
  };

  const handleFieldChange = () => {
    setConfirmDisabled(!isFormValid());
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <ProfileInfo donatorData={donatorData} />
        <DateInfoBox donatorData={donatorData} />
      </Box>

      {/* Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="contained" sx={{ mr: 1 }} onClick={handleClick}>
          Edit Profile
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Box sx={{ p: 2 }}>
            <h1>Edit Donor Profile</h1>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Name* (required)"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    handleFieldChange();
                  }}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Email*"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    handleFieldChange();
                  }}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Phone Number*"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    handleFieldChange();
                  }}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Address*"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    handleFieldChange();
                  }}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Donor Group"
                  value={selectedDonorGroup}
                  onChange={(e) => {
                    setSelectedDonorGroup(e.target.value);
                    handleFieldChange();
                  }}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="Individual">Individual</MenuItem>
                  <MenuItem value="Board Member">Board Member</MenuItem>
                  <MenuItem value="Foundation">Foundation</MenuItem>
                  <MenuItem value="Corporate">Corporate</MenuItem>
                  <MenuItem value="Gov/State">Gov/State</MenuItem>
                  <MenuItem value="Gov/Fed">Gov/Fed</MenuItem>
                  <MenuItem value="Gov/Municipal">Gov/Municipal</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Donation Type"
                  value={selectedDonorType}
                  onChange={(e) => {
                    setSelectedDonorType(e.target.value);
                    handleFieldChange();
                  }}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="Donation">Donation</MenuItem>
                  <MenuItem value="Sponsor">Sponsor</MenuItem>
                  <MenuItem value="Grant">Grant</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Organization name"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Organization email"
                  value={orgEmail}
                  onChange={(e) => setOrgEmail(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Organization address"
                  value={orgAddress}
                  onChange={(e) => setOrgAddress(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirm}
                disabled={confirmDisabled}
              >
                Confirm
              </Button>
            </Box>
          </Box>
        </Popover>
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
