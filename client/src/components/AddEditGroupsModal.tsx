import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Autocomplete,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useData } from '../util/api';

interface Group {
  _id: string;
  group_name: string;
  date_created: Date;
  donor_ids: string[];
}

interface Donor {
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
  org_name: string;
  org_email: string;
  org_address: string;
}

const initialGroups: Group[] = [
  {
    _id: '1',
    group_name: 'Group A',
    date_created: new Date('2023-01-01'),
    donor_ids: ['1'],
  },
  {
    _id: '2',
    group_name: 'Group B',
    date_created: new Date('2023-02-01'),
    donor_ids: ['2'],
  },
];

const fetchDonorsFromAPI = (): Promise<Donor[]> => {
  // Dummy function to fetch donors from an API
  // Replace this with your actual API call
  return Promise.resolve([
    {
      _id: '1',
      contact_name: 'John Doe',
      contact_email: 'john@example.com',
      contact_address: '123 Main St',
      contact_phone: '123-456-7890',
      donor_group: 'Group A',
      registered_date: new Date('2023-01-15'),
      last_donation_date: new Date('2023-03-01'),
      last_communication_date: new Date('2023-04-01'),
      type: 'Individual',
      comments: 'None',
      org_name: 'None',
      org_email: 'None',
      org_address: 'None',
    },
    {
      _id: '2',
      contact_name: 'Jane Doe',
      contact_email: 'jane@example.com',
      contact_address: '456 Main St',
      contact_phone: '987-654-3210',
      donor_group: 'Group B',
      registered_date: new Date('2023-02-15'),
      last_donation_date: new Date('2023-03-15'),
      last_communication_date: new Date('2023-04-15'),
      type: 'Individual',
      comments: 'None',
      org_name: 'None',
      org_email: 'None',
      org_address: 'None',
    },
    {
      _id: '3',
      contact_name: 'Alice Smith',
      contact_email: 'alice@example.com',
      contact_address: '789 Main St',
      contact_phone: '111-222-3333',
      donor_group: '',
      registered_date: new Date('2023-03-01'),
      last_donation_date: new Date('2023-04-01'),
      last_communication_date: new Date('2023-05-01'),
      type: 'Individual',
      comments: 'None',
      org_name: 'None',
      org_email: 'None',
      org_address: 'None',
    },
    {
      _id: '4',
      contact_name: 'Bob Johnson',
      contact_email: 'bob@example.com',
      contact_address: '321 Main St',
      contact_phone: '444-555-6666',
      donor_group: '',
      registered_date: new Date('2023-03-15'),
      last_donation_date: new Date('2023-04-15'),
      last_communication_date: new Date('2023-05-15'),
      type: 'Individual',
      comments: 'None',
      org_name: 'None',
      org_email: 'None',
      org_address: 'None',
    },
  ]);
};

const updateGroupDonorsAPI = (groupId: string, donorIds: string[]): Promise<void> => {
  // Dummy function to update group donors via API
  // Replace this with your actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const groupIndex = initialGroups.findIndex((group) => group._id === groupId);
      if (groupIndex !== -1) {
        initialGroups[groupIndex].donor_ids = donorIds;
      }
      resolve();
    }, 1000);
  });
};

export default function AddEditGroupsModal() {
  const [open, setOpen] = useState(true);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedDonors, setSelectedDonors] = useState<Donor[]>([]);
  const [unselectedDonors, setUnselectedDonors] = useState<Donor[]>([]);
  const [selectedDonorName, setSelectedDonorName] = useState<string | null>(null);

  const group = useData(`group/all`);
  const donors = useData(`donor/all`);

  useEffect(() => {
    const data = donors?.data || [];
    setUnselectedDonors(data);
    console.log(data);
  }, [donors]);

  useEffect(() => {
    const data = group?.data || [];
    setGroups(data);
    console.log(data);
  }, [group]);


  useEffect(() => {
    if (selectedGroup) {
      const allDonors = unselectedDonors.concat(selectedDonors);

      const selected = allDonors.filter((donor) =>
        selectedGroup.donor_ids.includes(donor._id),
      );
      
      const unselected = allDonors.filter(
        (donor) => !selectedGroup.donor_ids.includes(donor._id),
      );
      setSelectedDonors(selected);
      setUnselectedDonors(unselected);
    } else {
      setSelectedDonors([]);
      fetchDonorsFromAPI().then((donors) => {
        setUnselectedDonors(donors);
      });
    }
    setSelectedDonorName(''); // Reset selected donor value when group changes
  }, [selectedGroup]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleGroupChange = (event: React.ChangeEvent<{}>, value: string | null) => {
    const group = groups.find((g) => g.group_name === value) || null;
    setSelectedGroup(group);
  };

  const handleAddDonor = () => {
    const donor = unselectedDonors.find((d) => d.contact_name === selectedDonorName);
    if (donor) {
      setSelectedDonors([...selectedDonors, donor]);
      setUnselectedDonors(unselectedDonors.filter((d) => d._id !== donor._id));
      setSelectedDonorName('');
    }
  };

  const handleRemoveDonor = (donor: Donor) => {
    setSelectedDonors(selectedDonors.filter((d) => d._id !== donor._id));
    setUnselectedDonors([...unselectedDonors, donor]);
  };

  const handleSubmit = () => {
    if (selectedGroup) {
      const donorIds = selectedDonors.map((donor) => donor._id);
      updateGroupDonorsAPI(selectedGroup._id, donorIds) //update group
        .then(() => {
          setSelectedDonorName(''); // Reset selected donor value after submit
        })
        .catch((error) => {
          console.error('Error updating group donors:', error);
        });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        Add / Edit Groups
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Autocomplete
          freeSolo
          options={groups.map((option) => option.group_name)}
          renderInput={(params) => (
            <TextField {...params} label="Group Name" margin="normal" />
          )}
          onChange={handleGroupChange}
        />

        <Box display="flex" alignItems="center" style={{ flex: 1 }}>
          <Autocomplete
            style={{ flex: 1 }}
            freeSolo
            options={unselectedDonors.map((option) => option.contact_name)}
            renderInput={(params) => (
              <TextField {...params} label="Donor / Sponsor" margin="normal" />
            )}
            value={selectedDonorName}
            onChange={(event, value) => setSelectedDonorName(value)}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: '8px' }}
            onClick={handleAddDonor}
          >
            Add
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Remove</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedDonors.map((donor) => (
                <TableRow key={donor._id}>
                  <TableCell>{donor.contact_name}</TableCell>
                  <TableCell>{donor.contact_email}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleRemoveDonor(donor)}>
                      Remove {donor.contact_name}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '1rem',
          }}
        >
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}