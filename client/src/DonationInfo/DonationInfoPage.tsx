/* eslint-disable react-hooks/exhaustive-deps */
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useData } from '../util/api';
import { useAppDispatch } from '../util/redux/hooks';

function BasicTable({
  customRows,
}: {
  customRows: { label: string; value: string }[];
}) {
  return (
    <Box
      border="none"
      borderRadius={4}
      p={2}
      sx={{ width: 'min(500px, 100%)' }}
    >
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
  const donationID = '65daa89e6c34e8adb9f2d2c7';
  const donation = useData(`donation/${donationID}`);

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

  function setTableWithDonation() {
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
    }
  }

  useEffect(() => {
    setTableWithDonation();
  }, [donationData, donorName, purpose, setTableWithDonation]);

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

      {/* Render the BasicTable component with the updated customRows data */}
      <BasicTable customRows={customRows} />

      {!donationData.acknowledged && (
        <p style={{ marginTop: '16px', marginLeft: '16px' }}>
          This donation has not been acknowledged.
        </p>
      )}
      <Button
        onClick={() => navigate('/home')}
        style={{ marginLeft: '16px', background: 'blue', color: 'white' }}
      >
        Send them a message now
      </Button>
    </Box>
  );
}

export default DonationInfoPage;
