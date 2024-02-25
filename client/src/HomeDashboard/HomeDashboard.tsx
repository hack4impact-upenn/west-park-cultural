import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../util/redux/hooks';

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
  const [openPopup, setOpenPopup] = useState(false);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
  };

  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
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
            handleOpenPopup();
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

      {/* Popup */}
      <Dialog open={openPopup} onClose={handleClosePopup}>
        <DialogTitle>{`${
          alignment.charAt(0).toUpperCase() + alignment.slice(1)
        }'s Summary`}</DialogTitle>
        <DialogContent>
          {/* Render the BasicTable component with the alignment prop */}
          <BasicTable alignment={alignment} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup}>Close</Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
}

export default HomeDashboard;
