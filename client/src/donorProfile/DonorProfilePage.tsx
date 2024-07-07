/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Popover,
  Grid,
  Alert,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import Collapse from '@mui/material/Collapse';
import { useNavigate, useParams } from 'react-router-dom';
import ProfileInfo from './ProfileInfo';
import DateInfoBox from './DateInfoBox';
import DonorNoteBox from './DonorNoteBox';
import IDonor from '../util/types/donor';
import { useData, postData, getData } from '../util/api';
import DonationHistoryTable from '../components/tables/DonationHistoryTable';
import ConfirmModal from '../components/ConfirmationModal';

function DonorProfilePage() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [orgName, setOrgName] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [orgAddress, setOrgAddress] = useState('');
  const [selectedDonorGroup, setSelectedDonorGroup] = useState('');
  const [selectedDonorType, setSelectedDonorType] = useState('');
  const [confirmDisabled, setConfirmDisabled] = useState(true);
  const { donatorId } = useParams();
  const [numAck, setNumAck] = useState(0);
  const [totalDonation, setTotalDonation] = useState(0);

  const donator = useData(`donor/id/${donatorId}`);
  const [donatorData, setDonatorData] = useState<IDonor | null>(null);

  const donationsMade = useData(`donation/donor/${donatorId}`);
  const [alert, setAlert] = useState('');

  const navigate = useNavigate();

  const updateDonorAfterChange = (donorDataArg?: any) => {
    const donorDataInner = donorDataArg;
    if (donorDataInner) {
      setDonatorData(donorDataInner);
      setName(donorDataInner?.contact_name);
      setEmail(donorDataInner?.contact_email);
      setPhone(donorDataInner?.contact_phone);
      setAddress(donorDataInner?.contact_address);
      setSelectedDonorGroup(donorDataInner?.donor_group);
      setOrgName(donorDataInner?.org_name);
      setOrgEmail(donorDataInner?.org_email);
      setOrgAddress(donorDataInner?.org_address);
    }
  };

  useEffect(() => {
    updateDonorAfterChange(donator?.data);
  }, [donator]);

  useEffect(() => {
    if (donationsMade?.data) {
      setNumAck(
        donationsMade.data.filter((donation: any) => !donation.acknowledged)
          .length,
      );
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const totalDonation = donationsMade.data.reduce(
        (total: any, donation: any) => {
          return total + donation.amount;
        },
        0,
      );
      setTotalDonation(totalDonation);
    }
  }, [donationsMade?.data]);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    if (donatorData != null) {
      setName(donatorData.contact_name);
      setEmail(donatorData.contact_email);
      setPhone(donatorData.contact_phone);
      setAddress(donatorData.contact_address);
      setSelectedDonorGroup(donatorData.donor_group);
      setOrgName(donatorData.org_name);
      setOrgEmail(donatorData.org_email);
      setOrgAddress(donatorData.org_address);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setOrgName('');
    setOrgEmail('');
    setOrgAddress('');
    setSelectedDonorGroup('');
    setSelectedDonorType('');
    setConfirmDisabled(true);
  };

  const handleConfirm = () => {
    // update donor
    const updateDonor = {
      // eslint-disable-next-line no-underscore-dangle
      donor_id: donatorData ? donatorData._id : null,
      contact_name: name,
      contact_email: email,
      contact_address: address,
      contact_phone: phone,
      donor_group: selectedDonorGroup,
      registered_date: donatorData?.registered_date,
      last_donation_date: donatorData?.last_donation_date,
      last_communication_date: donatorData?.last_communication_date,
      type: donatorData?.type,
      comments: donatorData?.comments,
      org_address: orgAddress,
      org_email: orgEmail,
      org_name: orgName,
    };

    postData('donor/edit', updateDonor)
      .then((response2) => {
        // Handle the response here
        getData(`donor/id/${donatorId}`).then((response) => {
          updateDonorAfterChange(response.data);
          setAlert('1Donor updated successfully');
        });
      })
      .catch((error) => {
        // Handle the error here
        setAlert('0Error updating donor');
      });
    handleClose(); // Close the popover after confirming changes
  };

  const isFormValid = () => {
    return (
      name !== '' &&
      email !== '' &&
      phone !== '' &&
      address !== '' &&
      selectedDonorGroup !== ''
    );
  };

  const handleFieldChange = () => {
    setConfirmDisabled(!isFormValid());
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleDelete = () => {
    console.log();
  };

  const goCommunication = () => {
    navigate('/communications');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Collapse in={alert !== ''}>
        <div style={{ marginTop: '10px', marginBottom: '20px' }}>
          <Alert
            severity={
              alert.charAt(0) === '1'
                ? 'success'
                : alert.charAt(0) === '0'
                ? 'error'
                : 'info'
            }
            onClose={() => {
              setAlert('');
            }}
          >
            {alert.substring(1)}
          </Alert>
        </div>
      </Collapse>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <ProfileInfo donatorData={donatorData} />
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <DonorNoteBox donatorData={donatorData} />
          <DateInfoBox donatorData={donatorData} totalAmount={totalDonation} />
        </Box>
      </Box>

      {/* Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="contained" sx={{ mr: 1 }} onClick={handleClick}>
          Edit Profile
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Box sx={{ p: 2 }}>
            <h1>Edit Donor Profile</h1>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Name* (required)"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    handleFieldChange();
                  }}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Email*"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    handleFieldChange();
                  }}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Phone Number*"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    handleFieldChange();
                  }}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Address*"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    handleFieldChange();
                  }}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Donor Group*"
                  value={selectedDonorGroup}
                  onChange={(e) => {
                    setSelectedDonorGroup(e.target.value);
                    handleFieldChange();
                  }}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="Individual">Individual</MenuItem>
                  <MenuItem value="Board Member">Board Member</MenuItem>
                  <MenuItem value="Foundation">Foundation</MenuItem>
                  <MenuItem value="Corporate">Corporate</MenuItem>
                  <MenuItem value="Gov/State">Gov/State</MenuItem>
                  <MenuItem value="Gov/Fed">Gov/Fed</MenuItem>
                  <MenuItem value="Gov/Municipal">Gov/Municipal</MenuItem>
                </TextField>
              </Grid>
              {donatorData?.donor_group !== 'Individual' &&
              donatorData?.donor_group !== 'Board Member' ? (
                <>
                  <Grid item xs={6}>
                    <TextField
                      label="Organization name"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Organization email"
                      value={orgEmail}
                      onChange={(e) => setOrgEmail(e.target.value)}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Organization address"
                      value={orgAddress}
                      onChange={(e) => setOrgAddress(e.target.value)}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                </>
              ) : null}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirm}
                disabled={confirmDisabled}
              >
                Confirm
              </Button>
            </Box>
          </Box>
        </Popover>
        <Button variant="contained" color="primary" onClick={goCommunication}>
          Message
        </Button>
      </Box>

      <DonationHistoryTable donorId={donatorId || ''} />
      <div style={{ marginTop: '20px' }}>
        {' '}
        {numAck > 0 && (
          <p style={{ marginTop: '16px', marginLeft: '16px', color: 'red' }}>
            {numAck} donation{numAck > 1 ? 's have' : ' has'} not been
            acknowledged.
          </p>
        )}
        {numAck === 0 && (
          <p style={{ marginTop: '16px', marginLeft: '16px', color: 'green' }}>
            All donations have been acknowledged.
          </p>
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            paddingRight: '16px',
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
            {numAck > 0 && (
              <Button
                onClick={() => navigate('/home')}
                style={{
                  marginLeft: '16px',
                  background: '#417FED',
                  color: 'white',
                }}
              >
                Acknowledge their donations
              </Button>
            )}
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
            <ConfirmModal
              buttonText="Delete"
              title="Deleting"
              body="Are you sure you want to delete this donor? This will delete ALL information associated with this donor AND ALL 
            donations made by this donor."
              onConfirm={handleDelete}
            />
          </Box>
        </Box>
      </div>
    </Box>
  );
}

export default DonorProfilePage;
