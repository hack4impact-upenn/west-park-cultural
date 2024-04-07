import React, { useEffect, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
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
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { Typography } from '@mui/material';
import { postData, putData } from '../../util/api';

const filterDonors = createFilterOptions<DonorType>();
const filterPurposes = createFilterOptions<PurposeType>();

function SearchDonorsButton() {
  const [open, setOpen] = useState(false);
  const [donationType, setDonationType] = useState('Donors / Sponsors');
  // Add state for the select dropdowns
  const [timePeriod, setTimePeriod] = useState('');
  const [campaign, setCampaign] = useState('');
  const [yearType, setYearType] = useState('');
  const [minDonation, setMinDonation] = useState('');
  const [maxDonation, setMaxDonation] = useState('');
  const [filteredEmails, setFilteredEmails] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleDonationTypeChange = (event: any, newDonationType: string) => {
    if (newDonationType) {
      setDonationType(newDonationType.charAt(0).toUpperCase() + newDonationType.slice(1));
    }
  };

  const handleDonationRangeChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: string) => {
    const value = event.target.value;
    if (type === 'min') {
      setMinDonation(value);
    } else {
      setMaxDonation(value);
    }
  };
  

  useEffect(() => {
    // Assuming 'timePeriod' is a year string, and 'last_donation_date' can be converted to a year.
    // Further logic needed if 'campaign' and 'yearType' should also affect the filtering.
    const filteredDonors = testDonors.filter(donor => {
      const matchesDonationType = donor.type === donationType.toLowerCase();
      let matchesTimePeriod = true; // Assume true if timePeriod is not set

  
      // More conditions can be added here for 'campaign', 'yearType', etc.
      return matchesDonationType && matchesTimePeriod;
    });
    
    const emails = filteredDonors.map(donor => donor.contact_email).join(', ');
    setFilteredEmails(emails);
  }, [donationType]);


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
              <ToggleButton value="donor" aria-label="Donation">
                Donation
              </ToggleButton>
              <ToggleButton value="sponsor" aria-label="Sponsorship">
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
                value={minDonation}
                onChange={(e) => handleDonationRangeChange(e, 'min')}
              />
              <TextField
                label="maximum"
                variant="outlined"
                value={maxDonation}
                onChange={(e) => handleDonationRangeChange(e, 'max')}
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
                value={filteredEmails}
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


interface DonorType {
  inputValue?: string;
  title?: string;
  _id?: string;
  contact_name?: string;
  contact_email?: string;
  contact_address?: string;
  contact_phone?: string;
  donor_group?: string;
  registered_date?: { $date: { $numberLong: string } };
  last_donation_date?: { $date: { $numberLong: string } };
  last_communication_date?: string;
  type?: string;
  org_address?: string;
  org_email?: string;
  org_name?: string;
}

interface PurposeType {
  inputValue?: string;
  title?: string;
  _id?: string;
  name?: string;
  date_created?: Date;
}

const testDonors: DonorType[] = [
  {
    _id: '65daa67d6c34e8adb9f2d2c4',
    contact_name: 'John Smith',
    contact_email: 'jsmith@gmail.com',
    contact_address: '3820 Spruce',
    contact_phone: '609-297-6873',
    donor_group: 'Individual',
    registered_date: { $date: { $numberLong: '1463587200000' } },
    last_donation_date: { $date: { $numberLong: '1684425600000' } },
    last_communication_date: '',
    type: 'donor',
    org_address: '',
    org_email: '',
    org_name: '',
  },
  {
    _id: '65daa7356c34e8adb9f2d2c5',
    contact_name: 'Jane Doe',
    contact_email: 'jdoe@gmail.com',
    contact_address: '',
    contact_phone: '609-235-3525',
    donor_group: 'corporate',
    registered_date: { $date: { $numberLong: '1517673600000' } },
    last_donation_date: { $date: { $numberLong: '1635955200000' } },
    last_communication_date: '',
    type: 'sponsor',
    org_name: 'Company A',
    org_email: 'compa@gmail.com',
    org_address: '2934 Chestnut st',
  },
  {
    _id: '65daa8166c34e8adb9f2d2c6',
    contact_name: 'Lisa Webster',
    contact_email: 'lwebster@gmail.com',
    contact_address: '',
    contact_phone: '235-582-5325',
    donor_group: 'Government',
    registered_date: { $date: { $numberLong: '1663516800000' } },
    last_donation_date: { $date: { $numberLong: '1666540800000' } },
    last_communication_date: '2022-10-24T16:00:00.000+00:00',
    type: 'grant',
    org_address: 'Philadelphia',
    org_email: 'philly@gmail.com',
    org_name: 'Philadelphia Gov ',
  },
];