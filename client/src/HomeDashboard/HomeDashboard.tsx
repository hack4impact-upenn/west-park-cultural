import React from 'react';
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
import './homedashboard.css';

interface BasicTableProps {
  alignment: string;
}

function BasicTable({ alignment }: BasicTableProps) {
  let customRows: { label: string; value: string }[] = [];

  if (alignment === 'donation') {
    customRows = [
      { label: 'Total Donated', value: '$1350' },
      { label: 'Last Donation', value: '18 Hours Ago' },
      { label: 'Donated in last 90 Days', value: '$42' },
    ];
  } else if (alignment === 'sponsorship') {
    customRows = [
      { label: 'Total Sponsored', value: '$1350' },
      { label: 'Last Sponsorship', value: '18 Hours Ago' },
      { label: 'Sponsored in last 90 Days', value: '$42' },
    ];
  } else if (alignment === 'grant') {
    customRows = [
      { label: 'Total Granted', value: '$1350' },
      { label: 'Last Grant', value: '18 Hours Ago' },
      { label: 'Granted in last 90 Days', value: '$42' },
    ];
  }

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
            paddingRight: '20px',
          }}
        >
          Send them a message now{' '}
          <i
            className="fa fa-arrow-right"
            aria-hidden="true"
            style={{ marginLeft: '10px' }}
          />
        </Button>

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
