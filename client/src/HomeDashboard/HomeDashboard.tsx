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
import './homedashboard.css';

interface BasicTableProps {
  alignment: string;
}

function BasicTable({ alignment }: BasicTableProps) {
  let customRows: { label: string; value: string }[] = [];
  const donations = useData('donation/all');
  const [donationsData, setDonationsData] = useState<any>([]);

  useEffect(() => {
    const data = donations?.data || [];
    const filteredData = data.filter(
      (donation: any) => donation.type === alignment,
    );
    setDonationsData(filteredData);
  }, [donations?.data, alignment]);

  // calculate summary stats
  const totalDonated = donationsData.reduce(
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
      { label: 'Total Donated', value: `$${totalDonated.toLocaleString()}` },
      { label: 'Last Donation', value: last },
      {
        label: 'Donated in last 90 Days',
        value: `$${donatedInLast90Days.toLocaleString()}`,
      },
    ];
  } else if (alignment === 'sponsorship') {
    customRows = [
      { label: 'Total Sponsored', value: `$${totalDonated.toLocaleString()}` },
      { label: 'Last Sponsorship', value: last },
      {
        label: 'Sponsored in last 90 Days',
        value: `$${donatedInLast90Days.toLocaleString()}`,
      },
    ];
  } else if (alignment === 'grant') {
    customRows = [
      { label: 'Total Granted', value: `$${totalDonated.toLocaleString()}` },
      { label: 'Last Grant', value: last },
      {
        label: 'Granted in last 90 Days',
        value: `$${donatedInLast90Days.toLocaleString()}`,
      },
    ];
  }

  const numUnacknowledged = donationsData.filter(
    (donation: any) => !donation.acknowledged,
  ).length;

  return (
    <div className="basic-table">
      {/* <Box
      border="none"
      borderRadius={4}
      p={2}
      sx={{ width: 'min(500px, 100%)' }}
    > */}
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
      <p style={{ marginTop: '16px' }}>
        There are {numUnacknowledged} unacknowledged {alignment}s.
      </p>
      {/* </Box> */}
    </div>
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
    if (newAlignment) {
      setAlignment(newAlignment);
    }
  };

  function handleClick() {
    const s = `/home`;
    navigator(s);
  }

  return (
    <div className="max-width-wrapper">
      <div className="home-dashboard">
        <div className="home-dashboard-header">
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            style={{ marginTop: '16px', marginRight: '8px' }}
            fullWidth
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
              width: '200px',
              marginLeft: '100px',
              height: '44px',
              marginTop: '16px',
              marginBottom: '16px',
              boxShadow:
                '0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)',
            }}
          >
            View Report
          </Button>
        </div>
        {/* <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between" // Align items at start and end of the box
        width="100%" // Set box width to 100% of its container
        marginBottom={2}
        marginLeft={2} // Added marginLeft to align with the left edge
      ></Box> */}
        <Box marginBottom={0} marginLeft={2}>
          {/* Add a Typography for the title "Summary" */}
          <Typography variant="h4" style={{ marginTop: '30px' }}>
            Summary
          </Typography>
        </Box>

        {/* Render the BasicTable component with the alignment prop */}
        <BasicTable alignment={alignment} />

        <p style={{ marginTop: '16px', marginLeft: '16px' }}>
          There are{' '}
          <span className="redcircle">
            <span className="redcirclenumber">3</span>
          </span>{' '}
          unacknowledged {alignment}s.
        </p>

        <Button
          onClick={() => {
            handleClick();
          }}
          style={{
            marginLeft: '16px',
            background: '#24a0ed',
            color: 'white',
            marginRight: '16px',
            marginTop: '16px',
            padding: '15px',
          }}
        >
          Send them a message now{' '}
          <i
            className="fa fa-arrow-right"
            aria-hidden="true"
            style={{ marginLeft: '10px' }}
          />
        </Button>
<!--   START    </Box>

      <Box width="100%" marginBottom={4}>
        {/* Add a Typography for the title "Summary" */}
        <Typography variant="h4" gutterBottom>
          Summary
        </Typography>
        <BasicTable alignment={alignment} />
        <Button
          onClick={() => {
            handleClick();
          }}
          style={{
            background: '#0693e3',
            color: 'white',
            marginLeft: '15px',
            paddingLeft: '15px',
            paddingRight: '15px',
          }}
        >
          Send them a message now
        </Button>
      </Box>
      <Box width="100%" paddingRight={3}>
        <Typography variant="h4" gutterBottom>
          {alignment.charAt(0).toUpperCase() + alignment.slice(1)}s
        </Typography>
        <DonationsTable alignment={alignment} />
      </Box>
    </Box> END -->

        <Box marginBottom={2} marginLeft={2} marginTop={5}>
          <Typography variant="h4" gutterBottom>
            {alignment.charAt(0).toUpperCase() + alignment.slice(1)}s
          </Typography>
        </Box>
      </div>
    </div>
    // <Box display="flex" flexDirection="column" alignItems="flex-start">

    // </Box>
  );
}

export default HomeDashboard;
