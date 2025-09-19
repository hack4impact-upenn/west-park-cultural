import React, { useEffect } from 'react';
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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { postData } from '../util/api';
import DonationsTable from '../components/tables/DonationsTable';
import './homedashboard.css';

interface DonationData {
  amount: number;
  date: string;
  type: string;
  _id: string;
  id: string;
  acknowledged?: boolean;
}

interface BasicTableProps {
  alignment: string;
  filteredData?: DonationData[];
}

function BasicTable({ alignment, filteredData = [] }: BasicTableProps) {
  let customRows: { label: string; value: string | JSX.Element }[] = [];
  const navigate = useNavigate();
  const checkAuth = React.useCallback(() => {
    postData('auth/isLoggedIn').then((res) => {
      if (!(res && res?.data && res.data.loggedIn)) {
        navigate('/login');
      }
    });
  }, [navigate]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Memoize expensive calculations
  const { totalDonated, averageDonation, maxDonationElement } =
    React.useMemo(() => {
      const total = filteredData.reduce(
        (sum: number, donation: DonationData) => sum + donation.amount,
        0,
      );

      const average = filteredData.length > 0 ? total / filteredData.length : 0;

      const maxAmount =
        filteredData.length > 0
          ? Math.max(...filteredData.map((donation) => donation.amount))
          : 0;

      const maxItem = filteredData.find(
        (donation) => donation.amount === maxAmount,
      );

      const maxElement = maxItem ? (
        <a
          href={`/donationInfo/${maxItem.id}`}
          style={{ textDecoration: 'none', color: '#0883ff' }}
        >
          ${maxAmount.toLocaleString()}
        </a>
      ) : (
        <span>N/A</span>
      );

      return {
        totalDonated: total,
        averageDonation: average,
        maxDonationElement: maxElement,
      };
    }, [filteredData]);

  if (alignment === 'donation') {
    customRows = [
      { label: 'Total Donated', value: `$${totalDonated.toLocaleString()}` },
      {
        label: 'Average Donation',
        value: `$${averageDonation.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}`,
      },
      { label: 'Highest Donation', value: maxDonationElement },
    ];
  } else if (alignment === 'sponsorship') {
    customRows = [
      { label: 'Total Sponsored', value: `$${totalDonated.toLocaleString()}` },
      {
        label: 'Average Sponsorship',
        value: `$${averageDonation.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}`,
      },
      { label: 'Highest Sponsorship', value: maxDonationElement },
    ];
  } else if (alignment === 'grant') {
    customRows = [
      { label: 'Total Granted', value: `$${totalDonated.toLocaleString()}` },
      {
        label: 'Average Grant',
        value: `$${averageDonation.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}`,
      },
      { label: 'Highest Grant', value: maxDonationElement },
    ];
  }
  const numUnacknowledged = filteredData.filter(
    (donation: DonationData) => !donation.acknowledged,
  ).length;

  return (
    <div className="basic-table">
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
      {numUnacknowledged > 0 && (
        <div>
          <p style={{ marginTop: '16px' }}>
            There are{' '}
            <span className="redcircle">
              <span className="redcirclenumber">{numUnacknowledged}</span>
            </span>{' '}
            unacknowledged {alignment}s.
          </p>
          <Button
            onClick={() => navigate('/communications')}
            endIcon={<ArrowForwardIcon />}
            variant="contained"
            color="primary"
            size="large"
          >
            Send them a message now
          </Button>
        </div>
      )}
    </div>
  );
}

function HomeDashboard() {
  const navigate = useNavigate();
  const [alignment, setAlignment] = React.useState('donation'); // Default value for alignment
  const [filteredTableData, setFilteredTableData] = React.useState<
    DonationData[]
  >([]);

  const handleChange = React.useCallback(
    (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
      if (newAlignment) {
        setAlignment(newAlignment);
        setFilteredTableData([]); // Reset filtered data when alignment changes
      }
    },
    [setAlignment, setFilteredTableData],
  );

  const goReport = React.useCallback(() => {
    navigate('/reports');
  }, [navigate]);

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
            onClick={goReport}
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

        <Box marginBottom={1}>
          {/* Add a Typography for the title "Summary" */}
          <Typography variant="h4" style={{ marginTop: '30px' }}>
            Summary
          </Typography>
        </Box>

        {/* Render the BasicTable component with the alignment prop */}
        <BasicTable alignment={alignment} filteredData={filteredTableData} />

        <Box width="100%" marginBottom={10} marginTop={5}>
          <Typography variant="h4" gutterBottom>
            {alignment.charAt(0).toUpperCase() + alignment.slice(1)}s
          </Typography>
          <DonationsTable
            alignment={alignment}
            onFilteredDataChange={setFilteredTableData}
          />
        </Box>
      </div>
    </div>
  );
}

export default HomeDashboard;
