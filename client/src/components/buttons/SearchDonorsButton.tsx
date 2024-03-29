import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

function SearchDonorsButton() {
  const [open, setOpen] = useState(false);
  const [donationType, setDonationType] = useState('Donors / Sponsors');
  // Add state for the select dropdowns
  const [timePeriod, setTimePeriod] = useState('');
  const [campaign, setCampaign] = useState('');
  const [yearType, setYearType] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDonationTypeChange = (_event: any, newDonationType: string | null) => {
    if (newDonationType !== null) {
      const donationTypeLabel = newDonationType.charAt(0).toUpperCase() + newDonationType.slice(1);
      setDonationType(donationTypeLabel);
    }
  };

  // Implement handlers for select dropdowns
  // ...

  return (
    <div style={{ marginBottom: '10px' }}>
      <Button variant="outlined" onClick={handleClickOpen}>
        Search Donor
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Search All {donationType}</DialogTitle>
        <DialogContent>
          <Box sx={{ marginBottom: 2 }}>
            <ToggleButtonGroup
              color="primary"
              value={donationType.toLowerCase()} 
              exclusive
              onChange={handleDonationTypeChange}
              aria-label="Donation type"
            >
              <ToggleButton value="donation" aria-label="Donation">
                Donation
              </ToggleButton>
              <ToggleButton value="sponsorship" aria-label="Sponsorship">
                Sponsorship
              </ToggleButton>
              <ToggleButton value="grant" aria-label="Grant">
                Grant
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ marginBottom: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="time-period-label">In time period</InputLabel>
              <Select
                labelId="time-period-label"
                label="In time period"
                value={timePeriod}
                onChange={e => setTimePeriod(e.target.value)}
              >
                <MenuItem value="2020">2020</MenuItem>
                <MenuItem value="2021">2021</MenuItem>
                <MenuItem value="2022">2022</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ marginBottom: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="campaign-label">For Campaign</InputLabel>
              <Select
                labelId="campaign-label"
                label="For Campaign"
                value={campaign}
                onChange={e => setCampaign(e.target.value)}
              >
                <MenuItem value="A">Campaign A</MenuItem>
                <MenuItem value="B">Campaign B</MenuItem>
                <MenuItem value="C">Campaign C</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ marginBottom: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="year-type-label">Multi / Single-year</InputLabel>
              <Select
                labelId="year-type-label"
                label="Multi / Single-year"
                value={yearType}
                onChange={e => setYearType(e.target.value)}
              >
                <MenuItem value="single">Single Year</MenuItem>
                <MenuItem value="multi">Multi Year</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Typography variant="h6">Donation Range</Typography>
          <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
            <TextField
              label="minimum"
              variant="outlined"
              // Handle state change
            />
            <TextField
              label="maximum"
              variant="outlined"
              // Handle state change
            />
          </Box>

          <Typography variant="h6">Preview</Typography>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              label="Emails (autofill)"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              // Handle state change
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SearchDonorsButton;
