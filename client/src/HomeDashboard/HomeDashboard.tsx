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
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../util/redux/hooks';
import { useData } from '../util/api';
import DonationsTable from '../components/tables/DonationsTable';

interface BasicTableProps {
  alignment: string;
}

function BasicTable({ alignment }: BasicTableProps) {
  let customRows: { label: string; value: string }[] = [];
  const donations = useData('donation/all');
  const [donationsData, setDonationsData] = useState<any>([]);

  useEffect(() => {
    const data = donations?.data || [];
    console.log(data);
    setDonationsData(data);
  }, [donations?.data]);

  // calculate summary stats
  const total = donationsData.reduce(
    (total: number, donation: any) => total + donation.amount,
    0,
  );
  const sortedDonationsData = [...donationsData].sort(
    (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const lastDate =
    sortedDonationsData.length > 0
      ? new Date(sortedDonationsData[0].date)
      : null;
  let last = 'N/A';

  if (lastDate) {
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - lastDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

    if (daysDifference > 30) {
      const day = lastDate.getDate();
      const month = lastDate.toLocaleString('default', { month: 'long' });
      const year = lastDate.getFullYear();
      last = `${month} ${day}, ${year}`;
    } else if (daysDifference > 0) {
      last = `${daysDifference} days ago`;
    } else {
      const hoursDifference = Math.floor(timeDifference / (1000 * 3600));
      last = `${hoursDifference} hours ago`;
    }
  }
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const donatedInLast90Days = donationsData.reduce(
    (total: number, donation: any) => {
      const donationDate = new Date(donation.date);
      return donationDate >= ninetyDaysAgo ? total + donation.amount : total;
    },
    0,
  );

  if (alignment === 'donation') {
    customRows = [
      { label: 'Total Donated', value: `$${total.toLocaleString()}` },
      { label: 'Last Donation', value: last },
      { label: 'Donated in last 90 Days', value: `$${donatedInLast90Days}` },
    ];
  } else if (alignment === 'sponsorship') {
    customRows = [
      { label: 'Total Sponsored', value: `$${total.toLocaleString()}` },
      { label: 'Last Sponsorship', value: last },
      { label: 'Sponsored in last 90 Days', value: `$${donatedInLast90Days}` },
    ];
  } else if (alignment === 'grant') {
    customRows = [
      { label: 'Total Granted', value: `$${total.toLocaleString()}` },
      { label: 'Last Grant', value: last },
      { label: 'Granted in last 90 Days', value: `$${donatedInLast90Days}` },
    ];
  }

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

function HomeDashboard() {
  const dispatch = useAppDispatch();
  const navigator = useNavigate();
  const [alignment, setAlignment] = React.useState('donation'); // Default value for alignment

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
  };

  function handleClick() {
    const s = `/home`;
    navigator(s);
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-start">
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        marginBottom={2}
        marginLeft={2} // Added marginLeft to align with the left edge
      >
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleChange}
          style={{ marginTop: '16px', marginRight: '8px' }}
        >
          <ToggleButton value="donation">Donation</ToggleButton>
          <ToggleButton value="sponsorship">Sponsorship</ToggleButton>
          <ToggleButton value="grant">Grant</ToggleButton>
        </ToggleButtonGroup>

        <Button
          onClick={() => {
            handleClick();
          }}
          style={{
            background: 'grey',
            color: 'white',
            marginRight: '16px',
          }}
        >
          View Report
        </Button>
      </Box>

      <Box marginBottom={2} marginLeft={2}>
        {/* Add a Typography for the title "Summary" */}
        <Typography variant="h5" gutterBottom>
          Summary
        </Typography>
      </Box>

      {/* Render the BasicTable component with the alignment prop */}
      <BasicTable alignment={alignment} />

      <p style={{ marginTop: '16px', marginLeft: '16px' }}>
        There are 3 unacknowledged sponsorships.
      </p>

      <Button
        onClick={() => {
          handleClick();
        }}
        style={{ marginLeft: '16px', background: 'blue', color: 'white' }}
      >
        Send them a message now
      </Button>

      <Box marginBottom={2} marginLeft={2}>
        {/* Add a Typography for the title "Sponsorships" */}
        <Typography variant="h5" gutterBottom>
          {alignment.charAt(0).toUpperCase() + alignment.slice(1)}s
        </Typography>
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        marginBottom={2}
        marginLeft={2}
        sx={{
          width: '100%',
          justifyContent: 'flex-start',
        }}
      >
        <DonationsTable alignment={alignment} />
      </Box>
    </Box>
  );
}

export default HomeDashboard;
