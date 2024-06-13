/* eslint-disable no-underscore-dangle */
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
import { postData, useData } from '../util/api';

/**
 The New Donation Page
 */

const filterDonors = createFilterOptions<DonorType>();
const filterPurposes = createFilterOptions<PurposeType>();

function NewDonationPage() {
  const [donationType, setDonationType] = useState<string | null>('donation');
  const [grantYear, setGrantYear] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [donationDate, setDonationDate] = useState<Dayjs | null>(null);
  const [donator, setDonator] = useState<DonorType | null>(null);
  const [isNewDonator, setIsNewDonator] = useState(false);
  const [isNewPurpose, setIsNewPurpose] = useState(false);
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
    // console.log('purposes', data);
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

  const handleSubmit = () => {
    if (isNewDonator) {
      const newDonator = {
        contact_name: donator?.title,
        contact_email: newDonatorEmail,
        contact_address: newDonatorAddress,
        contact_phone: '0', // no input field for this yet
        donor_group: newDonatorGroup,
        registered_date: new Date(), // no input field for this yet
        last_donation_date: new Date(), // no input field for this yet
        type: '0', // no input field for this yet
        // comments: null,
        // _id: null,
      };

      postData('donor/create', newDonator)
        .then((response) => {
          setDonator(response.data);

          if (isNewPurpose) {
            const newPurpose = {
              name: campaignPurpose?.title,
              date_created: new Date(),
            };

            postData('purpose', newPurpose)
              .then((response1) => {
                setCampaignPurpose(response1.data);
                const newDonation = {
                  donor_id: response.data._id,
                  date: donationDate?.format('YYYY-MM-DD'),
                  amount: donationAmount,
                  purpose_id: response1.data._id,
                  payment_type: paymentType,
                  type: donationType,
                  comments: notes,
                };

                postData('donation/new', newDonation)
                  .then((response2) => {
                    // Handle the response here
                    console.log(response2);
                  })
                  .catch((error) => {
                    // Handle the error here
                    console.log(error);
                  });
              })
              .catch((error) => {
                // Handle the error here
                console.log(error);
              });
          } else {
            const newDonation = {
              donor_id: response.data._id,
              date: donationDate?.format('YYYY-MM-DD'),
              amount: donationAmount,
              purpose_id: campaignPurpose?._id,
              payment_type: paymentType,
              type: donationType,
              comments: notes,
            };

            postData('donation/new', newDonation)
              .then((response2) => {
                // Handle the response here
                console.log(response2);
              })
              .catch((error) => {
                // Handle the error here
                console.log(error);
              });
          }
        })
        .catch((error) => {
          // Handle the error here
          console.log(error);
        });
    } else if (isNewPurpose) {
      const newPurpose = {
        name: campaignPurpose?.title,
        date_created: new Date(),
      };

      postData('purpose', newPurpose)
        .then((response1) => {
          setCampaignPurpose(response1.data);
          const newDonation = {
            donor_id: donator?._id,
            date: donationDate?.format('YYYY-MM-DD'),
            amount: donationAmount,
            purpose_id: response1.data._id,
            payment_type: paymentType,
            type: donationType,
            comments: notes,
          };

          postData('donation/new', newDonation)
            .then((response2) => {
              // Handle the response here
              console.log(response2);
            })
            .catch((error) => {
              // Handle the error here
              console.log(error);
            });
        })
        .catch((error) => {
          // Handle the error here
          console.log(error);
        });
    } else {
      const newDonation = {
        donor_id: donator?._id,
        date: donationDate?.format('YYYY-MM-DD'),
        amount: donationAmount,
        purpose_id: campaignPurpose?._id,
        payment_type: paymentType,
        type: donationType,
        comments: notes,
      };

      postData('donation/new', newDonation)
        .then((response) => {
          // Handle the response here
          console.log(response);
        })
        .catch((error) => {
          // Handle the error here
          console.log(error);
        });
    }
  };

  return (
    <Grid container sx={{ m: 3 }} spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}> 
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
            const filtered = filterDonors(options, params);

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
            setIsNewPurpose(false);
            if (typeof newValue === 'string') {
              setCampaignPurpose({
                title: newValue,
              });
            } else if (newValue && newValue.inputValue) {
              // Create a new value from the user input
              setIsNewPurpose(true);
              setCampaignPurpose({
                title: newValue.inputValue,
              });
            } else {
              setCampaignPurpose(newValue);
            }
          }}
          filterOptions={(options, params) => {
            const filtered = filterPurposes(options, params);

            const { inputValue } = params;
            // Suggest the creation of a new value
            const isExisting = options.some(
              (option) => inputValue === option.title,
            );
            if (inputValue !== '' && !isExisting) {
              filtered.push({
                inputValue,
                name: inputValue,
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
            <MenuItem value="mail check">Mail Check</MenuItem>
            <MenuItem value="credit">Credit</MenuItem>
            <MenuItem value="paypal">Paypal</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIcon />}
          onClick={handleSubmit}
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