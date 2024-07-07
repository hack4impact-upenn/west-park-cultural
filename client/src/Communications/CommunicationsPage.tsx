/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from 'axios';
import {
  Typography,
  Grid,
  TextField,
  Autocomplete,
  Button,
  Stack,
  Modal,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Link,
} from '@mui/material';
import SearchDonorsButton from '../components/buttons/SearchDonorsButton';
import AddEditGroupsModal from '../components/AddEditGroupsModal';
import IDonor from '../util/types/donor';
import IGroup from '../util/types/group';
import IDonation from '../util/types/donation';
import { useData } from '../util/api';
import PopupPage from '../Popup/PopupPage';

const BACKENDURL = process.env.PUBLIC_URL
  ? process.env.PUBLIC_URL
  : 'http://localhost:4000';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '80%',
  maxHeight: '80%',
  overflow: 'auto',
  width: 600, // Adjust width as needed
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

type RowItem = {
  id: string;
  contact_name: string;
  contact_email: string;
};

interface DonorInfo {
  email: string;
  name: string;
  _id: string;
}

function CommunicationsPage() {
  const [unackDonoModalOpen, setUnackDonoModalOpen] = React.useState(false);
  const [editGroupModalOpen, setEditGroupModalOpen] = React.useState(false);
  const [unacknowledgedDonations, setUnacknowledgedDonations] = useState<any[]>(
    [],
  );
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedDonorID, setSelectedDonorID] = useState<string>('');

  const [groupSearchValue, setGroupSearchValue] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState<IGroup | null>(null);
  const [rows, setRows] = useState<RowItem[]>([]);

  const [donors, setDonors] = useState<IDonor[]>([]);
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [donations, setDonations] = useState<IDonation[]>([]);

  const allDonors: any | null = useData('donor/all');
  const allDonations: any | null = useData('donation/all');
  const allGroups: any | null = useData('group/all');

  useEffect(() => {
    if (allDonors?.data) {
      setDonors(allDonors.data);
    }
  }, [allDonors]);

  useEffect(() => {
    if (allDonations?.data) {
      setDonations(allDonations.data);
    }
  }, [allDonations]);

  useEffect(() => {
    if (allGroups?.data) {
      setGroups(allGroups.data);
    }
  }, [allGroups]);

  const handleUnackDonoModalOpen = async () => {
    try {
      console.log('opened');
      const temp = donations.filter(
        (donation: IDonation) => !donation.acknowledged,
      );
      const tempWithDonorInfo = await Promise.all(
        temp.map(async (donation: any) => {
          const donorInfoResponse = await axios.get(
            `${BACKENDURL}/api/donor/id/${donation.donor_id}`,
          );
          if (!donorInfoResponse) {
            return;
          }
          const donorInfo = donorInfoResponse.data;
          // eslint-disable-next-line consistent-return
          return {
            ...donation,
            donorName: donorInfo.contact_name,
            donorEmail: donorInfo.contact_email,
            donorId: donorInfo._id,
          };
        }),
      );
      setUnacknowledgedDonations(tempWithDonorInfo);
    } catch (error) {
      console.log(error);
    }
    setUnackDonoModalOpen(true);
  };

  const handleUnackDonoModalClose = () => setUnackDonoModalOpen(false);

  const handleGroupModalOpen = () => {
    setEditGroupModalOpen(true);
  };

  const handleGroupModalClose = () => {
    setEditGroupModalOpen(false);
  };

  const handlePopupClose = () => {
    setOpenPopup(false);
  };

  // Define a function to extract the correct ID
  const extractId = (id: string | { $oid: string }) => {
    return typeof id === 'string' ? id : id.$oid;
  };

  const handleNameChange = (
    event: React.SyntheticEvent,
    value: { name: string; id: string | { $oid: string } } | null,
  ) => {
    if (value) {
      const selectedPerson = donors.find(
        (person) => extractId(person._id) === value.id,
      );
      if (selectedPerson) {
        const existingRow = rows.find(
          (row) => row.id === extractId(selectedPerson._id),
        );
        if (existingRow) {
          return;
        }
        const newItem: RowItem = {
          id: extractId(selectedPerson._id),
          contact_name: selectedPerson.contact_name,
          contact_email: selectedPerson.contact_email,
        };
        setRows((prevRows: RowItem[]) => [...prevRows, newItem]);
      }
    }
  };

  const addGroupItem = () => {
    // Retrieve the donors associated with the selected group
    if (selectedGroup != null) {
      const groupDonors = donors.filter((donor) =>
        selectedGroup.donor_ids.includes(extractId(donor._id)),
      );

      // Filter out duplicates by comparing with existing rows
      const newRows = groupDonors.reduce((accumulator: RowItem[], donor) => {
        const existingRow = rows.find((row) => row.id === extractId(donor._id));
        if (!existingRow) {
          const newItem: RowItem = {
            id: extractId(donor._id),
            contact_name: donor.contact_name,
            contact_email: donor.contact_email,
          };
          accumulator.push(newItem);
        }
        return accumulator;
      }, []);

      // Update rows state with new rows
      setRows((prevRows) => [...prevRows, ...newRows]);
    }
    setGroupSearchValue(null);
  };

  const handleGroupChange = (
    event: React.SyntheticEvent,
    value: IGroup | null,
  ) => {
    if (value) {
      setSelectedGroup(value);
    }
  };

  const clearItems = () => {
    setRows([]);
  };

  const copyEmails = () => {
    let emailAsPasteFormat = '';
    rows.forEach((row) => {
      emailAsPasteFormat += `${row.contact_email}, `;
    });
    // TODO: add a toast message to indicate that the emails have been copied
    navigator.clipboard.writeText(emailAsPasteFormat).then(
      function () {
        console.log('Async: Copying to clipboard was successful!');
      },
      function (err) {
        console.error('Async: Could not copy text: ', err);
      },
    );
  };

  const handleRemovePerson = (idToRemove: string) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== idToRemove));
  };

  function formatDateString(dateString: string): string {
    if (dateString) {
      const date = new Date(dateString);
      const formattedDate = date.toISOString().slice(0, 10);
      return formattedDate;
    }
    return '';
  }

  function handleAddUnackDonation(
    selectedName: string,
    selectedEmail: string,
    selectedId: string,
  ) {
    if (selectedId) {
      const selectedPerson = donors.find(
        (person) => extractId(person._id) === selectedId,
      );
      if (selectedPerson) {
        const existingRow = rows.find(
          (row) => row.id === extractId(selectedPerson._id),
        );
        if (existingRow) {
          return;
        }
        const newItem: RowItem = {
          id: extractId(selectedPerson._id),
          contact_name: selectedPerson.contact_name,
          contact_email: selectedPerson.contact_email,
        };
        setRows((prevRows: RowItem[]) => [...prevRows, newItem]);
      }
    }
  }
  const handleFilteredDonors = (filteredDonors: DonorInfo[]) => {
    filteredDonors.forEach((donor: DonorInfo) => {
      handleAddUnackDonation(donor.name, donor.email, donor._id);
    });
  };

  const handleViewDonor = (donorID: string) => {
    setSelectedDonorID(donorID);
    setOpenPopup(true);
  };

  return (
    <Box paddingTop={2} paddingLeft={4} marginBottom={2}>
      <Box>
        <Typography
          variant="h4"
          sx={{ fontWeight: 'bold', marginBottom: '15px' }}
        >
          Communications
        </Typography>
        <p style={{ color: '#7C7C7C', marginBottom: '20px', maxWidth: '75%' }}>
          Send emails to individual users, groups of individuals, and mailing
          lists. Clicking the “email” button, will open a popup with the
          respective emails, which you can then copy and paste into your email
          application (i.e. Gmail or Outlook)
        </p>
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', marginBottom: '10px' }}
        >
          Individual Person
        </Typography>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={donors.map((option) => ({
            name: option.contact_name,
            id: option._id,
          }))}
          getOptionLabel={(option) => option.name}
          sx={{ width: 300, marginBottom: '15px' }}
          onChange={handleNameChange}
          renderInput={(params) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <TextField {...params} label="Search Name" />
          )}
        />
      </Box>
      <Box sx={{ width: '40%' }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', marginBottom: '10px' }}
        >
          Groups
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUnackDonoModalOpen}
          size="large"
          sx={{ marginBottom: '5px' }}
          endIcon={<ArrowForwardIcon />}
          fullWidth
          style={{ justifyContent: 'flex-start' }}
        >
          Email Unacknowledged Donations
        </Button>

        <SearchDonorsButton onConfirm={handleFilteredDonors} />
        <Button
          variant="contained"
          color="inherit"
          sx={{ marginBottom: '5px' }}
          fullWidth
          onClick={handleGroupModalOpen}
        >
          Add / Edit Groups
        </Button>
        <AddEditGroupsModal
          open={editGroupModalOpen}
          onClose={handleGroupModalClose}
        />
        <PopupPage
          open={openPopup}
          onClose={handlePopupClose}
          donorID={selectedDonorID}
        />
        <Stack
          spacing={{ xs: 2 }}
          direction="row"
          useFlexGap
          flexWrap="wrap"
          sx={{ marginBottom: '10px' }}
        >
          <Autocomplete
            disablePortal
            id="group-search"
            options={groups}
            getOptionLabel={(option) => option.group_name}
            value={groupSearchValue}
            onChange={handleGroupChange}
            sx={{ width: '66%' }}
            renderInput={(params) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <TextField {...params} label="Search Name" />
            )}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={addGroupItem}
            sx={{ width: '30%' }} // Adjust the width as needed
          >
            Add Group
          </Button>
        </Stack>
      </Box>
      <Box sx={{ width: '80%' }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', marginBottom: '10px' }}
        >
          Emails
        </Typography>
        <TableContainer component={Paper} sx={{ marginBottom: '20px' }}>
          <Table sx={{ minWidth: 650 }} aria-label="communications table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Remove</TableCell>
                <TableCell>View Summary</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {row.contact_name}
                  </TableCell>
                  <TableCell>{row.contact_email}</TableCell>
                  <TableCell>
                    <Link href="#" onClick={() => handleRemovePerson(row.id)}>
                      Remove {row.contact_name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href="#" style={{ textDecoration: 'none', color: '#0883ff'  }} onClick={() => handleViewDonor(row.id)}>
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box display="flex" justifyContent="space-between" marginBottom={2}>
          <Button
            variant="contained"
            color="inherit"
            onClick={clearItems}
            size="large"
          >
            Clear
          </Button>
          <Button
            onClick={copyEmails}
            variant="contained"
            color="primary"
            size="large"
            style={{ marginLeft: 'auto' }} // This will push the button to the right end
          >
            Copy All Emails
          </Button>
        </Box>
      </Box>

      <Modal
        open={unackDonoModalOpen}
        onClose={handleUnackDonoModalClose}
        aria-labelledby="Email Unacknowledged Donations Modal"
        aria-describedby="Email Unacknowledged Donations Modal"
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h6">
            Contact Unacknowledged Donations
          </Typography>
          {unacknowledgedDonations.map((donation) => (
            <Box
              key={donation._id}
              sx={{
                p: 2,
                my: 1,
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <Typography variant="body1">Amount: {donation.amount}</Typography>
              <Typography variant="body1">
                Date: {formatDateString(donation.date) || 'N/A'}
              </Typography>
              <Typography variant="body1">
                Donor Name: {donation.donorName}
              </Typography>
              <Typography variant="body1">
                Donor Email: {donation.donorEmail}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                style={{ marginTop: '10px' }}
                onClick={() =>
                  handleAddUnackDonation(
                    donation.donorName,
                    donation.donorEmail,
                    donation.donorId,
                  )
                }
              >
                Add
              </Button>
            </Box>
          ))}
          <Button onClick={handleUnackDonoModalClose}>Close</Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default CommunicationsPage;
