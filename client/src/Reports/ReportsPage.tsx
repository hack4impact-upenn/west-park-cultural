/* eslint-disable no-alert */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
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
import { useData, postData } from '../util/api';
import useDonationStatistics from './useDonationStatistics';
import dayjs from 'dayjs'; 
import IReports from '../util/types/reports';

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

interface BasicTableProps {
  alignment: string;
  report: IReports | undefined;
}

function BasicTable({ alignment, report }: BasicTableProps) {
  let customRows: { title: string; value: string,  hasChange: boolean, changeValue: string, changeSymbol: boolean }[] = [];
  if (report) {
    let data;
    switch (alignment) {
      case 'last_all':
        data = report.last_all;
        break;
      case 'last_fiscal':
        data = report.last_fiscal;
        break;
      case 'last_calendar':
        data = report.last_calendar;
        break;
      case 'last_90':
        data = report.last_90;
        break;
      case 'last_30':
        data = report.last_30;
        break;
      default:
        data = report.last_all;
    }

    customRows = [
      createData('Total Donated', `$${data.total_donated}`, false, '', false),
      createData('Total Donations', `${data.total_donations}`, false, '', false),
      createData('Average Donation', `$${data.average_donations.toFixed(2)}`, false, '', false),
      createData('Average Donations Per Person', `$${data.average_donations_per_person.toFixed(2)}`, false, '', false),
      createData('Top Donator', `${data.top_donator.donor_name}`, false, '', false),
      createData('Largest Donation', `$${data.largest_donation.amount} (${data.largest_donation.donor_name})`, false, '', false),
    ];
  } else {
    customRows = [
      createData('Total Donated', 'No report data', false, '', false),
      createData('Total Donations', 'No report data', false, '', false),
      createData('Average Donation', 'No report data', false, '', false),
      createData('Average Donations Per Person', 'No report data', false, '', false),
      createData('Top Donator', 'No report data', false, '', false),
      createData('Largest Donation', 'No report data', false, '', false),
    ];
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="report table">
        <TableBody>
          {customRows.map((row) => (
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
  );
}

function ReportsPage() {
  const {
    getReportForDateRange,
  } = useDonationStatistics();

  const [alignment, setAlignment] = useState('last_all');
  const [report, setReport] = useState<IReports>();
  const [allReports, setAllReports] = useState<IReports[]>([]);
  const [confirmationModalOpen, setConfirmationModalOpen] = React.useState(false);
  const handleConfirmationModalOpen = () => setConfirmationModalOpen(true);
  const handleConfirmationModalClose = () => setConfirmationModalOpen(false);
  const [pastReportsModalOpen, setPastReportsModalOpen] = React.useState(false);
  const handlePastReportsModalOpen = () => setPastReportsModalOpen(true);
  const handlePastReportsModalClose = () => setPastReportsModalOpen(false);
  const reports = useData('reports/all');

  useEffect(() => {
    const data = reports?.data || [];
    setAllReports(data);
  }, [reports]);

  const handleTimeInterval = (
    event: React.MouseEvent<HTMLElement>,
    newTimeInterval: string,
  ) => {
    setAlignment(newTimeInterval);
  };

  const validateReportData = (data) => {
    return data && data.totalAmountDonated != null && data.totalNumberOfDonations != null;
  };

  useEffect(() => {
    if (allReports && allReports.length > 0) {
      const sortedReports = allReports.sort((a, b) => new Date(b.date_generated).getTime() - new Date(a.date_generated).getTime());
      const mostRecentReport = sortedReports[0];
      setReport(mostRecentReport);
    }
  }, [allReports]);


  const generateReport = (retries = 3, delay = 1000) => {
    const now = dayjs();

    const lastFiscalYrReportData = getReportForDateRange(dayjs().startOf('year').subtract(1, 'year'), dayjs().startOf('year'));
    const lastCalYrReportData = getReportForDateRange(dayjs().startOf('year').subtract(1, 'year'), dayjs().endOf('year').subtract(1, 'year'));
    const last90DaysReportData = getReportForDateRange(now.subtract(90, 'days'), now);
    const last30DaysReportData = getReportForDateRange(now.subtract(30, 'days'), now);
    const allReportData = getReportForDateRange(dayjs('1960-01-01'), now);

    const newReportData = {
      last_fiscal: lastFiscalYrReportData,
      last_calendar: lastCalYrReportData,
      last_90: last90DaysReportData,
      last_30: last30DaysReportData,
      last_all: allReportData,
    };

    if (validateReportData(newReportData.last_90) || retries <= 0) {
      postData('reports/create', newReportData)
        .then((response) => {
          console.log(response);
          setReport(response.data);
        })
        .catch((error) => {
          console.log(error);
        });

      } else {
        setTimeout(() => generateReport(retries - 1, delay), delay);
      }
  };

  return (
    <div>
      <Grid container sx={{ m: 3 }} spacing={2}>
        <Grid item xs={8}>
          <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
            Report on {dayjs().format('MM/DD/YYYY')}
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
            onClick={() => generateReport()}
          >
            Generate New Report
          </Button>
        </Grid>
        <Grid item xs={12}>
          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={handleTimeInterval}
            aria-label="time interval"
            size="large"
          >
            <ToggleButton value="last_all" aria-label="allTime">
              All Time
            </ToggleButton>
            <ToggleButton value="last_fiscal" aria-label="lastFiscalYr">
              Last Fiscal Yr
            </ToggleButton>
            <ToggleButton value="last_calendar" aria-label="lastCalYr">
              Last Cal Yr
            </ToggleButton>
            <ToggleButton value="last_90" aria-label="last90Days">
              Last 90 Days
            </ToggleButton>
            <ToggleButton value="last_30" aria-label="last30Days">
              Last 30 Days
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>

        <BasicTable alignment={alignment} report={report} />

        {/* <Grid item xs={12}>
          
        </Grid> */}

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
