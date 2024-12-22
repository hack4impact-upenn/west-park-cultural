/* eslint-disable no-underscore-dangle */
/* eslint-disable */
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Navigate, NavigateFunction, useNavigate } from 'react-router-dom';
import {
  Typography,
  Grid,
  TextField,
  SelectChangeEvent,
  MenuItem,
  InputLabel,
  Select,
  FormHelperText,
  Alert,
  Collapse,
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
  const [successMessage, setSuccessMessage] = useState(false);
  const [donationDate, setDonationDate] = useState<Dayjs | null>(null);
  const [donator, setDonator] = useState<DonorType | null>(null);
  const [isNewDonator, setIsNewDonator] = useState(false);
  const [isNewPurpose, setIsNewPurpose] = useState(false);
  const [newDonatorEmail, setNewDonatorEmail] = useState('N/A');
  const [newDonatorPhone, setNewDonatorPhone] = useState('N/A');
  const [newDonatorAddress, setNewDonatorAddress] = useState('N/A');
  const [newDonatorGroup, setNewDonatorGroup] = useState('');
  const [isValidInput, setIsValidInput] = useState(true);
  const [campaignPurpose, setCampaignPurpose] = useState<PurposeType | null>(
    null,
  );
  const [notes, setNotes] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [otherPaymentType, setOtherPaymentType] = useState('');

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
    // console.log(data);
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

  const handleNewDonatorPhoneChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewDonatorPhone(event.target.value);
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

  const checkValidInput = () => {
    return (
      donationDate != null &&
      paymentType !== '' &&
      donationAmount !== '' &&
      // eslint-disable-next-line radix
      parseInt(donationAmount) >= 0 &&
      donator != null &&
      campaignPurpose != null &&
      (donationType !== 'grant' || (grantYear != null && grantYear !== ''))
    );
  };

  const determineDonorType = () => {
    switch (donationType) {
      case 'donation':
        return 'donor';
      case 'sponsorship':
        return 'sponsor';
      case 'grant':
        return 'grant';
      default:
        return 'donor';
    }
  };

  const resetPage = () => {
    setDonationAmount('');
    setGrantYear('');
    setDonationDate(null);
    setDonator(null);
    setNewDonatorEmail('');
    setNewDonatorAddress('');
    setNewDonatorPhone('');
    setIsNewDonator(false);
    setNewDonatorGroup('');
    setCampaignPurpose(null);
    setNotes('');
    setPaymentType('');
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    setAlertHelper('1Donation successfully added!');
  };

  useEffect(() => {
    if (successMessage) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      // setAlertHelper('1Donation successfully added!');
    }
  }, [successMessage]);

  const [alert, setAlert] = useState('');
  const setAlertHelper = (msg: string) => {
    setAlert('');
    setTimeout(() => {
      setAlert(msg);
    }, 100);
  };

  const handleSubmit = () => {
    if (checkValidInput()) {
      setAlert('');
      if (isNewDonator) {
        const newDonator = {
          contact_name: donator?.title,
          contact_email: newDonatorEmail,
          contact_address: newDonatorAddress,
          contact_phone: newDonatorPhone,
          donor_group: newDonatorGroup,
          registered_date: new Date(),
          last_donation_date: donationDate,
          type: determineDonorType(),
        };
        postData('donor/create', newDonator)
          .then((donorResponse) => {
            setDonator(donorResponse.data);
            setDonorsData((prevDonators) => [
              ...prevDonators,
              donorResponse.data,
            ]);
            if (isNewPurpose) {
              const newPurpose : PurposeType = {
                name: campaignPurpose?.title,
                date_created: new Date(),
              };
              postData('purpose', newPurpose)
                .then((response1) => {
                  setCampaignPurpose(response1.data);
                  setPurposesData((prevPurposes) => [
                    ...prevPurposes,
                    response1.data,
                  ]);
                  const newDonation = {
                    donor_id: donorResponse.data._id,
                    date: donationDate?.format('YYYY-MM-DD'),
                    amount: donationAmount,
                    purpose_id: response1.data._id,
                    payment_type: paymentType === 'other' ? otherPaymentType : paymentType,
                    type: donationType,
                    comments: notes,
                  };
                  postData('donation/new', newDonation)
                    .then((response2) => {
                      setPurposesData((prevPurposesData) => [...prevPurposesData, newPurpose]);
                      resetPage();
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
                donor_id: donorResponse.data._id,
                date: donationDate?.format('YYYY-MM-DD'),
                amount: donationAmount,
                purpose_id: campaignPurpose?._id,
                payment_type: paymentType === 'other' ? otherPaymentType : paymentType, 
                type: donationType,
                comments: notes,
              };
              postData('donation/new', newDonation)
                .then((response2) => {
                  resetPage();
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
        const newPurpose : PurposeType = {
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
              payment_type: paymentType === 'other' ? otherPaymentType : paymentType,
              type: donationType,
              comments: notes,
            };
            postData('donation/new', newDonation)
              .then((response2) => {
                setPurposesData((prevPurposesData) => [...prevPurposesData, newPurpose]);
                resetPage();
                // console.log(response2);
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
        // TODO: check this
        // eslint-disable-next-line camelcase
        const last_donate_date_fix: any = donator?.last_donation_date;
        if (donationDate?.isAfter(last_donate_date_fix)) {
          if (!donator) return;
          const data = { id: donator._id, last_donation_date: donationDate };
          postData('donor/updateRecent', data)
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      } else {
        const newDonation = {
          donor_id: donator?._id,
          date: donationDate?.format('YYYY-MM-DD'),
          amount: donationAmount,
          purpose_id: campaignPurpose?._id,
          payment_type: paymentType === 'other' ? otherPaymentType : paymentType,
          type: donationType,
          comments: notes,
        };
        postData('donation/new', newDonation)
          .then((response) => {
            resetPage();
            console.log(response);
          })
          .catch((error) => {
            // Handle the error here
            console.log(error);
          });
      }
      // TODO: check this
      // eslint-disable-next-line camelcase
      const last_donate_date_fix: any = donator?.last_donation_date;
      if (donationDate?.isAfter(last_donate_date_fix)) {
        if (!donator) return;
        const data = { id: donator._id, last_donation_date: donationDate };
        postData('donor/updateRecent', data)
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      setAlertHelper('0Please fill in and check all input fields!');
    }
  };

  return (
    <div style={{ width: 'inherit' }} className="max-width-wrapper-small">
      <Grid
        container
        sx={{
          // marginLeft: '0px',
          marginRight: '24px',
          marginTop: '24px',
          marginBottom: '24px',
        }}
        spacing={2}
      >
        <Box width="100%">
          <Collapse in={alert !== ''}>
            <Alert
              sx={{ marginLeft: '16px' }}
              severity={
                // eslint-disable-next-line no-nested-ternary
                alert.charAt(0) === '1'
                  ? 'success'
                  : alert.charAt(0) === '0'
                  ? 'error'
                  : 'info'
              }
              onClose={() => {
                setAlertHelper('');
              }}
            >
              {alert.substring(1)}
            </Alert>
          </Collapse>
        </Box>

        <Grid item xs={12}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Register New Donation
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ width: '100%' }}>
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
            <FormControl sx={{ width: '100%' }}>
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
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={donationDate}
              label="Donation Date*"
              onChange={(newDonationDate) => setDonationDate(newDonationDate)}
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            sx={{ width: '100%' }}
            value={donator}
            onChange={(event, newValue) => {
              setIsNewDonator(false);
              console.log(newValue);
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
              sx={{ width: '100%' }}
            />
          </Grid>
        )}
        {isNewDonator && (
          <Grid item xs={12}>
            <FormControl sx={{ width: '100%' }}>
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
              label="New Donator Phone"
              type="phone"
              value={newDonatorPhone}
              onChange={handleNewDonatorPhoneChange}
              sx={{ width: '100%' }}
            />
          </Grid>
        )}
        {isNewDonator && (
          <Grid item xs={12}>
            <TextField
              label="New Donator Address"
              type="text"
              value={newDonatorAddress}
              onChange={handleNewDonatorAddressChange}
              sx={{ width: '100%' }}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Autocomplete
            sx={{ width: '100%' }}
            value={campaignPurpose}
            onChange={(event, newValue) => {
              setIsNewPurpose(false);
              if (typeof newValue === 'string') {
                setCampaignPurpose({
                  title: newValue,
                });
              } else if (newValue && newValue.inputValue) {
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
                (option) => inputValue === option.name,
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
            rows={4}
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel>Payment Type*</InputLabel>
            <Select
              value={paymentType}
              label="Payment Type"
              required
              onChange={(e) => {
                handlePaymentTypeChange(e);
                setOtherPaymentType('');
              }}
            >
              <MenuItem value="check">Check</MenuItem>
              <MenuItem value="credit card">Credit Card</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {paymentType === 'other' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Specify Other Payment Type"
              value={otherPaymentType}
              onChange={(e) => setOtherPaymentType(e.target.value)}
              required
            />
          </Grid>
        )}

        {isValidInput === false && (
          <Typography sx={{ color: 'error.main', ml: 2 }} variant="body2">
            Please fill in and check all input fields
          </Typography>
        )}

        {successMessage && (
          <Typography sx={{ color: 'blue', ml: 2 }} variant="body2">
            Successfully registered the donation.
          </Typography>
        )}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            onClick={handleSubmit}
            sx={{ width: '100%' }}
            size="large"
            style={{ justifyContent: 'flex-start' }}
          >
            Register Donation
          </Button>
        </Grid>
      </Grid>
    </div>
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
