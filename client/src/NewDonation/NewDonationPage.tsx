import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import {
  Typography,
  Grid,
  TextField,
  SelectChangeEvent,
  MenuItem,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { Dayjs } from 'dayjs';
import FormControl from '@mui/material/FormControl';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box } from '@mui/system';
import { useData } from '../util/api';

/**
 The New Donation Page
 */

const filter = createFilterOptions<DonorType>();

function NewDonationPage() {
  const [donationType, setDonationType] = useState<string | null>('donation');
  const [grantYear, setGrantYear] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [donationDate, setDonationDate] = useState<Dayjs | null>(null);
  const [donator, setDonator] = useState<DonorType | null>(null);
  const [isNewDonator, setIsNewDonator] = useState(false);
  const [newDonatorEmail, setNewDonatorEmail] = useState('');
  const [newDonatorAddress, setNewDonatorAddress] = useState('');
  const [newDonatorGroup, setNewDonatorGroup] = useState('');
  const [campaignPurpose, setCampaignPurpose] = useState<PurposeType | null>(
    null,
  );
  const [notes, setNotes] = useState('');
  const [paymentType, setPaymentType] = useState('');

  const donors = useData('donor/all');
  const [donorsData, setDonorsData] = useState<DonorType[]>([]);
  useEffect(() => {
    const data = donors?.data || [];
    setDonorsData(data);
  }, [donors]);

  const purposes = useData('purpose');
  const [purposesData, setPurposesData] = useState<PurposeType[]>([]);

  useEffect(() => {
    const data = purposes?.data || [];
    console.log('purposes', data);
    setPurposesData(data);
  }, [purposes]);

  const handleDonationType = (
    event: React.MouseEvent<HTMLElement>,
    newDonationType: string | null,
  ) => {
    setDonationType(newDonationType);
  };

  const handleDonationAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setDonationAmount(event.target.value);
  };

  const handleNewDonatorEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewDonatorEmail(event.target.value);
  };

  const handleNewDonatorAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewDonatorAddress(event.target.value);
  };

  const handleNewDonatorGroupChange = (event: SelectChangeEvent) => {
    setNewDonatorGroup(event.target.value);
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.target.value);
  };

  const handlePaymentTypeChange = (event: SelectChangeEvent) => {
    setPaymentType(event.target.value);
  };

  return (
    <Grid container sx={{ m: 3 }} spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
          Register New Donation
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ width: '50%' }}>
          <ToggleButtonGroup
            value={donationType}
            exclusive
            onChange={handleDonationType}
            aria-label="donation type"
            size="large"
            fullWidth
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
        </Box>
      </Grid>
      {donationType === 'grant' && (
        <Grid item xs={12}>
          <FormControl sx={{ width: '40%' }}>
            <InputLabel required={donationType === 'grant'}>
              Grant Year
            </InputLabel>
            <Select
              value={grantYear}
              label="Grant Year"
              onChange={(event) => setGrantYear(event.target.value)}
              required={donationType === 'grant'}
            >
              <MenuItem value="multi-year">Multi-Year</MenuItem>
              <MenuItem value="single-year">Single-Year</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      )}
      <Grid item xs={12}>
        <TextField
          id="outlined-number"
          label="Donation Amount"
          type="number"
          value={donationAmount}
          onChange={handleDonationAmountChange}
          required
          sx={{ width: '40%' }}
        />
      </Grid>
      <Grid item xs={12}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={donationDate}
            label="Donation Date"
            onChange={(newDonationDate) => setDonationDate(newDonationDate)}
            sx={{ width: '40%' }}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          sx={{ width: '40%' }}
          value={donator}
          onChange={(event, newValue) => {
            setIsNewDonator(false);
            if (typeof newValue === 'string') {
              setDonator({
                title: newValue,
              });
            } else if (newValue && newValue.inputValue) {
              // Create a new value from the user input
              setIsNewDonator(true);
              setDonator({
                title: newValue.inputValue,
              });
            } else {
              setDonator(newValue);
            }
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            const { inputValue } = params;
            // Suggest the creation of a new value
            const isExisting = options.some(
              (option) => inputValue === option.contact_name,
            );
            if (inputValue !== '' && !isExisting) {
              filtered.push({
                inputValue,
                contact_name: inputValue,
                title: `Add "${inputValue}"`,
              });
            }

            return filtered;
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          id="donator-picker"
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          options={donorsData}
          getOptionLabel={(option) => {
            // Value selected with enter, right from the input
            if (typeof option === 'string') {
              return option;
            }
            // Add "xxx" option created dynamically
            if (option.title) {
              return option.title!;
            }
            // Regular option
            return option.contact_name!;
          }}
          renderOption={(props, option) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <li {...props}>
              {option.title ? option.title : option.contact_name}
            </li>
          )}
          freeSolo
          renderInput={(params) => (
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...params}
              label="Donator"
              required
              helperText="Search for a previous donater. If they are a new donater, a profile will be created automatically. All donaters must have unique names."
            />
          )}
        />
      </Grid>
      {isNewDonator && (
        <Grid item xs={12}>
          <TextField
            label="New Donator Email"
            type="email"
            value={newDonatorEmail}
            onChange={handleNewDonatorEmailChange}
            required={isNewDonator}
            sx={{ width: '40%' }}
          />
        </Grid>
      )}
      {isNewDonator && (
        <Grid item xs={12}>
          <FormControl sx={{ width: '40%' }}>
            <InputLabel required={isNewDonator}>New Donator Group</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={newDonatorGroup}
              label="New Donator Group"
              onChange={handleNewDonatorGroupChange}
              required={isNewDonator}
            >
              <MenuItem value="Individual">Individual</MenuItem>
              <MenuItem value="Board Member">Board Member</MenuItem>
              <MenuItem value="Foundation">Foundation</MenuItem>
              <MenuItem value="Corporate">Corporate</MenuItem>
              <MenuItem value="Gov/State">Gov/State</MenuItem>
              <MenuItem value="Gov/Fed">Gov/Fed</MenuItem>
              <MenuItem value="Gov/Municipal">Gov/Municipal</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      )}
      {isNewDonator && (
        <Grid item xs={12}>
          <TextField
            label="New Donator Address"
            type="text"
            value={newDonatorAddress}
            onChange={handleNewDonatorAddressChange}
            sx={{ width: '40%' }}
          />
        </Grid>
      )}

      <Grid item xs={12}>
        <Autocomplete
          sx={{ width: '40%' }}
          value={campaignPurpose}
          onChange={(event, newValue) => {
            if (typeof newValue === 'string') {
              setCampaignPurpose({
                title: newValue,
              });
            } else if (newValue && newValue.inputValue) {
              // Create a new value from the user input
              setCampaignPurpose({
                title: newValue.inputValue,
              });
            } else {
              setCampaignPurpose(newValue);
            }
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            const { inputValue } = params;
            // Suggest the creation of a new value
            const isExisting = options.some(
              (option) => inputValue === option.title,
            );
            if (inputValue !== '' && !isExisting) {
              filtered.push({
                contact_name: inputValue,
                title: `Add "${inputValue}"`,
              });
            }

            return filtered;
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          id="free-solo-with-text-demo"
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          options={purposesData}
          getOptionLabel={(option) => {
            // Value selected with enter, right from the input
            if (typeof option === 'string') {
              return option!;
            }
            // Add "xxx" option created dynamically
            if (option.title) {
              return option.title!;
            }
            // Regular option
            return option.name!;
          }}
          renderOption={(props, option) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <li {...props}>{option.title ? option.title : option.name}</li>
          )}
          freeSolo
          renderInput={(params) => (
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...params}
              label="Campaign / Purpose"
              required
              helperText="
              Search for a campaign / purpose that already has donations, or type a
          new campaign. All campaigns must have unique names."
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Notes"
          type="text"
          value={notes}
          onChange={handleNotesChange}
          multiline
          sx={{ width: '40%' }}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl sx={{ width: '40%' }}>
          <InputLabel>Payment Type</InputLabel>
          <Select
            value={paymentType}
            label="Payment Type"
            onChange={handlePaymentTypeChange}
          >
            <MenuItem value="Mail Check">Mail Check</MenuItem>
            <MenuItem value="Credit">Credit</MenuItem>
            <MenuItem value="Paypal">Paypal</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIcon />}
          onClick={() => {
            alert('clicked');
          }}
          sx={{ width: '40%' }}
          size="large"
          style={{ justifyContent: 'flex-start' }}
        >
          Register Donation
        </Button>
        <FormHelperText>Donation ID: #####</FormHelperText>
      </Grid>
    </Grid>
  );
}

export default NewDonationPage;

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
