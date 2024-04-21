/* eslint-disable no-underscore-dangle */
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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { match } from 'assert';
import { postData, putData, useData } from '../../util/api';

function SearchDonorsButton() {
  const [open, setOpen] = useState(false);
  const [donationType, setDonationType] = useState('donation');
  // Add state for the select dropdowns
  const [campaign, setCampaign] = useState('');
  const [yearType, setYearType] = useState('');
  const [minDonation, setMinDonation] = useState('');
  const [maxDonation, setMaxDonation] = useState('');
  const [filteredEmails, setFilteredEmails] = useState('');

  const [startTimePeriod, setStartTimePeriod] = React.useState<Dayjs | null>(
    dayjs(),
  );

  const [endTimePeriod, setEndTimePeriod] = React.useState<Dayjs | null>(
    dayjs(),
  );

  const donations = useData(`donation/all`);
  const purposes = useData('purpose/');
  const donors = useData(`donor/all`);

  const [purposesData, setPurposesData] = useState<PurposeType[]>([]);
  useEffect(() => {
    const data = purposes?.data || null;
    setPurposesData(data);
  }, [purposes]);

  const [donationsData, setDonationsData] = useState<DonationType[]>([]);
  useEffect(() => {
    const data = donations?.data || null;
    setDonationsData(data);
  }, [donations]);

  const [donorsData, setDonorsData] = useState<DonorType[]>([]);
  useEffect(() => {
    const data = donors?.data || null;
    setDonorsData(data);
  }, [donors]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDonationTypeChange = (event: any, newDonationType: string) => {
    if (newDonationType) {
      setDonationType(
        newDonationType.charAt(0).toUpperCase() + newDonationType.slice(1),
      );
    }
  };

  const handleDonationRangeChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: string,
  ) => {
    const { value } = event.target;
    if (type === 'min') {
      setMinDonation(value);
    } else {
      setMaxDonation(value);
    }
  };

  useEffect(() => {
    // Assuming 'timePeriod' is a year string, and 'last_donation_date' can be converted to a year.
    // Further logic needed if 'campaign' and 'yearType' should also affect the filtering.
    if (!donationsData) {
      console.log('Donations data is null');
      return;
    }

    const filteredDonations = donationsData.filter((donation) => {
      const matchesDonationType = donation.type === donationType.toLowerCase();
      const donationDate = dayjs(donation.date);
      const matchesTimePeriod =
        (donationDate.isAfter(startTimePeriod) ||
          donationDate.isSame(startTimePeriod)) &&
        (donationDate.isBefore(endTimePeriod) ||
          donationDate.isSame(endTimePeriod));
      const matchesPurpose = donation.purpose_id === campaign;
      let matchesAmount = false;
      if (minDonation !== '' && maxDonation !== '') {
        const minDonationNumber = Number(minDonation);
        const maxDonationNumber = Number(maxDonation);
        matchesAmount =
          donation.amount >= minDonationNumber &&
          donation.amount <= maxDonationNumber;
      }
      let matchesYearType = true;
      if (donationType === 'grant') {
        matchesYearType = donation.grant_year === yearType;
      }

      return (
        matchesDonationType &&
        matchesTimePeriod &&
        matchesPurpose &&
        matchesAmount &&
        matchesYearType
      );
    });

    console.log('FILTERED DONATIONS');
    console.log(filteredDonations);

    const emails = filteredDonations.map((donation) => {
      const donor = donorsData.find(
        (currDonor) => currDonor._id === donation.donor_id,
      );
      return donor ? donor.contact_email : 'No email found';
    });
    const uniqueEmailsArray = Array.from(new Set(emails));
    const uniqueEmails = uniqueEmailsArray.join(', ');

    console.log('EMAILS');
    console.log(uniqueEmails);

    setFilteredEmails(uniqueEmails);
  }, [
    donationType,
    donationsData,
    purposesData,
    minDonation,
    maxDonation,
    donorsData,
    campaign,
    startTimePeriod,
    endTimePeriod,
    yearType,
  ]);

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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Time Period"
                  value={startTimePeriod}
                  onChange={(newValue) => setStartTimePeriod(newValue)}
                  sx={{ marginBottom: 1 }}
                />
                <DatePicker
                  label="End Time Period"
                  value={endTimePeriod}
                  onChange={(newValue) => setEndTimePeriod(newValue)}
                />
              </LocalizationProvider>
            </FormControl>
          </Box>

          <Box sx={{ marginBottom: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="campaign-label">For Campaign</InputLabel>
              <Select
                labelId="campaign-label"
                label="For Campaign"
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
              >
                {purposesData &&
                  purposesData.map((purpose) => (
                    <MenuItem key={purpose._id} value={purpose._id}>
                      {purpose.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>

          {donationType === 'Grant' ? (
            <Box sx={{ marginBottom: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="year-type-label">
                  Multi / Single-year
                </InputLabel>
                <Select
                  labelId="year-type-label"
                  label="Multi / Single-year"
                  value={yearType}
                  onChange={(e) => setYearType(e.target.value)}
                >
                  <MenuItem value="single">Single Year</MenuItem>
                  <MenuItem value="multi">Multi Year</MenuItem>
                </Select>
              </FormControl>
            </Box>
          ) : null}

          <Typography variant="h6">Donation Range</Typography>
          <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
            <TextField
              label="Minimum"
              variant="outlined"
              value={minDonation}
              onChange={(e) => handleDonationRangeChange(e, 'min')}
            />
            <TextField
              label="Maximum"
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

interface DonationType {
  _id: string;
  donor_id: string;
  date: Date;
  amount: number;
  purpose_id: string;
  acknowledged: boolean;
  payment_type: string;
  type: string;
  grant_year?: string;
}

interface PurposeType {
  inputValue?: string;
  title?: string;
  _id?: string;
  name?: string;
  date_created?: Date;
}
