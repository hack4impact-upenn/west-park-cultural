/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
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
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import CloseIcon from '@mui/icons-material/Close';
import { useData, postData } from '../util/api';

const filterGroup = createFilterOptions<Group>();

interface Group {
  _id?: string;
  title?: string;
  inputValue?: string;
  group_name?: string;
  date_created?: Date;
  donor_ids?: string[];
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

const updateGroupDonorsAPI = (selectedGroup: Group, donorIds: string[]) => {
  const updatedGroup = {
    _id: selectedGroup._id,
    group_name: selectedGroup.group_name,
    date_created: selectedGroup.date_created,
    donor_ids: donorIds,
  };
  console.log(updatedGroup);

  return postData('group/edit', updatedGroup);
};

export default function AddEditGroupsModal({ open, onClose }: any) {
  // const [open, setOpen] = React.useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedDonors, setSelectedDonors] = useState<Donor[]>([]);
  const [unselectedDonors, setUnselectedDonors] = useState<Donor[]>([]);
  const [allDonors, setAllDonors] = useState<Donor[]>([]);
  const [selectedDonorName, setSelectedDonorName] = useState<string | null>(
    null,
  );
  const [isNewGroup, setIsNewGroup] = useState(false);

  const group = useData(`group/all`);
  const donors = useData(`donor/all`);

  useEffect(() => {
    const data = donors?.data || [];
    setUnselectedDonors(data);
    setAllDonors(data);
    console.log(data);
  }, [donors]);

  useEffect(() => {
    if (selectedGroup) {
      const selected = allDonors.filter((donor) =>
        (selectedGroup.donor_ids || []).includes(donor._id),
      );

      const unselected = allDonors.filter(
        (donor) => !(selectedGroup.donor_ids || []).includes(donor._id),
      );

      setSelectedDonors(selected);
      setUnselectedDonors(unselected);
    } else {
      setSelectedDonors([]);
      setUnselectedDonors(allDonors);
    }
    setSelectedDonorName(''); // Reset selected donor value when group changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroup]);

  useEffect(() => {
    const data = group?.data || [];
    setGroups(data);
  }, [group]);
  
  const handleAddDonor = () => {
    const donor = unselectedDonors.find(
      (d) => d.contact_name === selectedDonorName,
    );
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
      // console.log(selectedGroup);
      const donorIds = selectedDonors.map((donor) => donor._id);

      updateGroupDonorsAPI(selectedGroup, donorIds) // update group
        .then(() => {
          setSelectedDonorName(''); // Reset selected donor value after submit
          onClose();
        })
        .catch((error) => {
          console.error('Error updating group donors:', error);
        });
    }
  };

  const handleAddNewGroup = (newGroup: Group) => {
    if (newGroup) {
      const newData = {
        group_name: newGroup.group_name,
        date_created: new Date(),
        donor_ids: [],
      };

      postData('group/create', newData)
        .then((response) => {
          setGroups((prevGroups) => [...prevGroups, response.data]);
          setSelectedGroup(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Add / Edit Groups
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Autocomplete
          value={selectedGroup}
          onChange={(event, newValue) => {
            setIsNewGroup(false);
            // console.log(newValue);
            if (typeof newValue === 'string') {
              setSelectedGroup({
                group_name: newValue,
              });
            } else if (newValue && newValue.inputValue) {
              // Create a new value from the user input
              setIsNewGroup(true);
              handleAddNewGroup(newValue);
            } else {
              setSelectedGroup(newValue);
            }
          }}
          filterOptions={(options, params) => {
            const filtered = filterGroup(options, params);

            const { inputValue } = params;
            // Suggest the creation of a new value
            const isExisting = options.some(
              (option) => inputValue === option.group_name,
            );
            if (inputValue !== '' && !isExisting) {
              filtered.push({
                inputValue,
                group_name: inputValue,
                title: `Add "${inputValue}"`,
              });
            }
            return filtered;
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          id="free-solo-with-text-demo"
          options={groups}
          getOptionLabel={(option) => {
            // Value selected with enter, right from the input
            if (typeof option === 'string') {
              return option;
            }
            // Add "xxx" option created dynamically
            if (option.title) {
              return option.group_name ?? '';
            }
            // Regular option
            return option.group_name || '';
          }}
          renderOption={(props, option) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <li {...props}>
              {option.title ? option.title : option.group_name}
            </li>
          )}
          sx={{ width: 300 }}
          freeSolo
          renderInput={(params) => (
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...params}
              label="Group"
              required
              helperText="Search for a previous communication group. If they are a new group, a group will be created automatically. All groups must have unique names."
            />
          )}
        />

        <Box display="flex" alignItems="center" style={{ flex: 1 }}>
          <Autocomplete
            style={{ flex: 1 }}
            freeSolo
            options={unselectedDonors.map((option) => option.contact_name)}
            renderInput={(params) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
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
          <Button variant="outlined" onClick={onClose}>
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
