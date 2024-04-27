/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Button,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  Select,
  FormHelperText,
  FormControl,
  InputLabel,
  TextField,
  SelectChangeEvent,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { borderRadius, width } from '@mui/system';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import dayjs, { Dayjs } from 'dayjs';
import { useData, postData } from '../util/api';
import { useAppDispatch } from '../util/redux/hooks';
import ConfirmModal from '../components/ConfirmationModal';

const filterDonors = createFilterOptions<DonorType>();
const filterPurposes = createFilterOptions<PurposeType>();

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 4,
  overflow: 'scroll',
  height: '80%',
};

function BasicTable({
  customRows,
}: {
  customRows: { label: string; value: string }[];
}) {
  return (
    <Box border="none" borderRadius={4} p={2} sx={{ width: '100%' }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 300 }} aria-label="simple table">
          <TableBody>
            {customRows.map((row) => (
              <TableRow key={row.label}>
                <TableCell component="th" scope="row">
                  {row.label}
                </TableCell>
                <TableCell align="right">{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function DonationInfoPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [donationData, setDonationData] = useState<any>([]);
  const [customRows, setCustomRows] = useState<
    { label: string; value: string }[]
  >([]);
  const [donorName, setDonorName] = useState('');
  const [purpose, setPurpose] = useState('');

  // Fetch donation data from API
  const donationID = '65ff8bb31e7005cf6092267a';
  const donation = useData(`donation/${donationID}`);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  useEffect(() => {
    const fetchDonorAndPurpose = async () => {
      if (donation?.data) {
        setDonationData(donation.data);
        if (donation.data.donor_id) {
          try {
            const res = await axios.get(
              `http://localhost:4000/api/donor/${donation.data.donor_id}`,
            );
            setDonorName(res.data.contact_name);
            setDonator(res.data);
          } catch (error) {
            console.error('Failed to fetch donor name:', error);
          }
        }

        if (donation.data.purpose_id) {
          try {
            const res = await axios.get(
              `http://localhost:4000/api/purpose/${donation.data.purpose_id}`,
            );
            setPurpose(res.data.name);
            setCampaignPurpose(res.data);
          } catch (error) {
            console.error('Failed to fetch donor name:', error);
          }
        }
      }
    };

    fetchDonorAndPurpose();
  }, [donation?.data]);

  function formatDateString(dateString: string): string {
    if (dateString) {
      const date = new Date(dateString);
      const formattedDate = date.toISOString().slice(0, 10);
      return formattedDate;
    }
    return '';
  }

  useEffect(() => {
    if (donationData) {
      const updatedCustomRows = [
        {
          label: 'Donation Amount',
          value: `$ ${donationData.amount}` || 'N/A',
        },
        {
          label: 'Date Donated',
          value: formatDateString(donationData.date) || 'N/A',
        },
        { label: 'Donor', value: donorName || 'N/A' },
        {
          label: 'Payment Information',
          value: donationData.payment_type || 'N/A',
        },
        { label: 'Campaign Category', value: purpose || 'N/A' },
        {
          label: 'Acknowledged?',
          value: donationData.acknowledged ? 'Yes' : 'No',
        },
      ];
      setCustomRows(updatedCustomRows);
      setDonationAmount(donationData.amount);
      setDonationDate(dayjs(donationData.date));
      setPaymentType(donationData.payment_type);
    }
  }, [donationData, donorName, purpose]);

  const handleEditButtonClick = () => {
    setIsEditModalOpen(true);
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

  const handlePaymentTypeChange = (event: SelectChangeEvent) => {
    setPaymentType(event.target.value);
  };

  const handleDelete = () => {
    const body = { donation_id: donationData._id };
    postData('donation/delete', body)
      .then(() => {
        navigate('/home');
      })
      .catch((error) => {
        console.error('Failed to delete donation:', error);
      });
  };

  const handleSubmit = () => {
    setIsEditModalOpen(false);
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
                  donation_id: donationData._id,
                  donor_id: response.data._id,
                  date: donationDate?.format('YYYY-MM-DD'),
                  amount: donationAmount,
                  purpose_id: response1.data._id,
                  payment_type: paymentType,
                  type: donationType,
                  comments: notes,
                };

                postData('donation/edit', newDonation)
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
              donation_id: donationData._id,
              donor_id: response.data._id,
              date: donationDate?.format('YYYY-MM-DD'),
              amount: donationAmount,
              purpose_id: campaignPurpose?._id,
              payment_type: paymentType,
              type: donationType,
              comments: notes,
            };

            postData('donation/edit', newDonation)
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
            donation_id: donationData._id,
            donor_id: donator?._id,
            date: donationDate?.format('YYYY-MM-DD'),
            amount: donationAmount,
            purpose_id: response1.data._id,
            payment_type: paymentType,
            type: donationType,
            comments: notes,
          };

          postData('donation/edit', newDonation)
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
        donation_id: donationData._id,
        donor_id: donator?._id,
        date: donationDate?.format('YYYY-MM-DD'),
        amount: donationAmount,
        purpose_id: campaignPurpose?._id,
        payment_type: paymentType,
        type: donationType,
        comments: notes,
      };

      postData('donation/edit', newDonation)
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
    <Box display="flex" flexDirection="column" alignItems="flex-start">
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        marginBottom={2}
        marginLeft={2}
      >
        <Typography variant="h5" gutterBottom>
          Donation Information
        </Typography>
      </Box>

      <Box width="100%">
        {/* Render the BasicTable component with the updated customRows data */}
        <BasicTable customRows={customRows} />

        {!donationData.acknowledged && (
          <p style={{ marginTop: '16px', marginLeft: '16px' }}>
            This donation has not been acknowledged.
          </p>
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              width: '50%',
            }}
          >
            <Button
              onClick={() => navigate('/home')}
              style={{ marginLeft: '16px', background: 'blue', color: 'white' }}
            >
              Send them a message now -{'>'}
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              width: '50%',
              gap: '16px',
            }}
          >
            <Button
              onClick={handleEditButtonClick}
              style={{ background: 'gray', color: 'white', width: '100px' }}
            >
              Edit
            </Button>
            {/* <Button
              onClick={() => navigate('/home')}
              style={{
                background: 'red',
                color: 'white',
                width: '100px',
                marginRight: '16px',
              }}
            >
              Delete
            </Button> */}
            <ConfirmModal
              buttonText="Delete"
              title="Are you sure you want to delete this donation?"
              body=""
              onConfirm={handleDelete}
            />
          </Box>
        </Box>
      </Box>

      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Box sx={style}>
          <Grid container sx={{ m: 2 }} spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Edit Donation
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ width: '100%' }} />
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
                  onChange={(newDonationDate) =>
                    setDonationDate(newDonationDate)
                  }
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
                  <InputLabel required={isNewDonator}>
                    New Donator Group
                  </InputLabel>
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
                  <li {...props}>
                    {option.title ? option.title : option.name}
                  </li>
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
              <Divider sx={{ width: '100%' }} />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  width: '90%',
                  gap: '16px',
                }}
              >
                <Button
                  onClick={() => setIsEditModalOpen(false)}
                  style={{ background: 'gray', color: 'white', width: '100px' }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  color="primary"
                  variant="contained"
                  style={{
                    width: '100px',
                  }}
                >
                  Confirm
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
}

export default DonationInfoPage;

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
