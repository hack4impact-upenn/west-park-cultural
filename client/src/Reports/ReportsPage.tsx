/* eslint-disable no-alert */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';

import {
  Typography,
  Grid,
  Modal,
  Box,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';
import { PieChart, LineChart, BarChart } from '@mui/x-charts';
import { ArrowUpward, ArrowDownward, Remove } from '@mui/icons-material';

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

function createData(
  title: string,
  value: string,
  hasChange: boolean,
  changeValue: string,
  changeSymbol: boolean, // true for up, false for down
) {
  return { title, value, hasChange, changeValue, changeSymbol };
}

const rows = [
  createData('Total Donated', '$1350', true, '$12', true),
  createData('Total Donations', '45', true, '2', true),
  createData('Average Donation', '$12.30', true, '$1.50', false),
  createData('Average Donations Per Person', '1.2', true, '$12', false),
  createData('Top Donator', 'John Doe (15 donations, $32)', false, '', false),
  createData('Largest Donation', '$451 (Jane Doe)', false, '', false),
];

function ReportsPage() {
  const [timeInterval, setTimeInterval] = useState<string | null>('last90Days');
  const [confirmationModalOpen, setConfirmationModalOpen] =
    React.useState(false);
  const handleConfirmationModalOpen = () => setConfirmationModalOpen(true);
  const handleConfirmationModalClose = () => setConfirmationModalOpen(false);

  const [pastReportsModalOpen, setPastReportsModalOpen] = React.useState(false);
  const handlePastReportsModalOpen = () => setPastReportsModalOpen(true);
  const handlePastReportsModalClose = () => setPastReportsModalOpen(false);

  const handleTimeInterval = (
    event: React.MouseEvent<HTMLElement>,
    newTimeInterval: string | null,
  ) => {
    setTimeInterval(newTimeInterval);
  };

  return (
    <div>
      <Grid container sx={{ m: 3 }} spacing={2}>
        <Grid item xs={8}>
          <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
            Report on 12/31/2023
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmationModalOpen}
          >
            Download / Share
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="inherit"
            onClick={handlePastReportsModalOpen}
          >
            View Past Reports
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              alert('generate new report clicked');
            }}
          >
            Generate New Report
          </Button>
        </Grid>
        <Grid item xs={12}>
          <ToggleButtonGroup
            value={timeInterval}
            exclusive
            onChange={handleTimeInterval}
            aria-label="time interval"
            size="large"
          >
            <ToggleButton value="allTime" aria-label="allTime">
              All Time
            </ToggleButton>
            <ToggleButton value="lastFiscalYr" aria-label="lastFiscalYr">
              Last Fiscal Yr
            </ToggleButton>
            <ToggleButton value="lastCalYr" aria-label="lastCalYr">
              Last Cal Yr
            </ToggleButton>
            <ToggleButton value="last90Days" aria-label="last90Days">
              Last 90 Days
            </ToggleButton>
            <ToggleButton value="last30Days" aria-label="last30Days">
              Last 30 Days
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="report table">
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.title}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.title}
                    </TableCell>
                    <TableCell align="right">{row.value}</TableCell>
                    {row.hasChange ? (
                      <TableCell align="right">
                        {row.changeSymbol ? (
                          <Stack
                            direction="row"
                            alignItems="center"
                            style={{ color: 'green' }}
                            justifyContent="end"
                          >
                            <ArrowUpward />
                            {row.changeValue}
                          </Stack>
                        ) : (
                          <Stack
                            direction="row"
                            alignItems="center"
                            style={{ color: 'red' }}
                            justifyContent="end"
                          >
                            <ArrowDownward />
                            {row.changeValue}
                          </Stack>
                        )}
                      </TableCell>
                    ) : (
                      <TableCell align="right">
                        <Remove />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" spacing={2}>
            <Box>
              <Typography variant="h6" align="center">
                Campaign Breakdown
              </Typography>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: 10, label: 'series A' },
                      { id: 1, value: 15, label: 'series B' },
                      { id: 2, value: 20, label: 'series C' },
                    ],
                  },
                ]}
                width={400}
                height={200}
              />
            </Box>
            <Box>
              <Typography variant="h6" align="center">
                Donation Category
              </Typography>
              <LineChart
                xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                series={[
                  {
                    data: [2, 5.5, 2, 8.5, 1.5, 5],
                  },
                ]}
                width={500}
                height={300}
              />
            </Box>
            <Box>
              <Typography variant="h6" align="center">
                Communication Categories
              </Typography>
              <BarChart
                xAxis={[
                  {
                    scaleType: 'band',
                    data: ['group A', 'group B', 'group C'],
                  },
                ]}
                series={[
                  { data: [4, 3, 5] },
                  { data: [1, 6, 3] },
                  { data: [2, 5, 6] },
                ]}
                width={500}
                height={300}
              />
            </Box>
          </Stack>
        </Grid>
      </Grid>

      <Modal
        open={confirmationModalOpen}
        onClose={handleConfirmationModalClose}
        aria-labelledby="Confirmation Modal"
        aria-describedby="Download or Share Report"
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Do you want to download the report?
          </Typography>
          <Typography sx={{ mt: 2 }}>If so, click Confirm below.</Typography>
          <Button onClick={handleConfirmationModalClose}>Cancel</Button>
          <Button onClick={handleConfirmationModalClose}>Confirm</Button>
        </Box>
      </Modal>

      <Modal
        open={pastReportsModalOpen}
        onClose={handlePastReportsModalClose}
        aria-labelledby="Past Reports Modal"
        aria-describedby="View Past Reports Report"
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Past Reports
          </Typography>
          <Button onClick={handlePastReportsModalClose}>Close</Button>
        </Box>
      </Modal>
    </div>
  );
}

export default ReportsPage;
