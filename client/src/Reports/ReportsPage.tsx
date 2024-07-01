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
  prevReport: IReports | undefined;
}

const getDifference = (newValue: number | null, oldValue: number | null) => {
  if (newValue === null || oldValue === null) {
    return { changeValue: 'N/A', changeSymbol: false };
  }
  const difference = newValue - oldValue;
  return {
    changeValue: `${difference >= 0 ? '+' : ''}${difference.toFixed(2)}`,
    changeSymbol: difference >= 0,
  };
};

function BasicTable({ alignment, report, prevReport }: BasicTableProps) {
  const getReportData = (report: IReports | undefined, alignment: string) => {
    if (!report || report === undefined) return null;
    switch (alignment) {
      case 'last_all':
        return report.last_all;
      case 'last_fiscal':
        return report.last_fiscal;
      case 'last_calendar':
        return report.last_calendar;
      case 'last_90':
        return report.last_90;
      case 'last_30':
        return report.last_30;
      default:
        return report.last_all;
    }
  };

  const data = getReportData(report, alignment);
  const prevData = getReportData(prevReport, alignment);

  const createRows = (data, prevData) => {
    if (!data) {
      return [
        createData('Total Donated', 'No report data', false, '', false),
        createData('Total Donations', 'No report data', false, '', false),
        createData('Average Donation', 'No report data', false, '', false),
        createData('Average Donations Per Person', 'No report data', false, '', false),
        createData('Top Donator', 'No report data', false, '', false),
        createData('Largest Donation', 'No report data', false, '', false),
      ];
    }

    if (!prevData) {
      return [
        createData('Total Donated', `$${data.total_donated}`, false, '', false),
        createData('Total Donations', `${data.total_donations}`, false, '', false),
        createData('Average Donation', `$${data.average_donations?.toFixed(2)}`, false, '', false),
        createData('Average Donations Per Person', `$${data.average_donations_per_person?.toFixed(2)}`, false, '', false),
        createData('Top Donator', `${data.top_donator?.donor_name}`, false, '', false),
        createData('Largest Donation', `$${data.largest_donation?.amount} (${data.largest_donation?.donor_name})`, false, '', false),
      ];
    }

    return [
      createData('Total Donated', `$${data.total_donated}`, true, getDifference(data.total_donated, prevData.total_donated).changeValue, getDifference(data.total_donated, prevData.total_donated).changeSymbol),
      createData('Total Donations', `${data.total_donations}`, true, getDifference(data.total_donations, prevData.total_donations).changeValue, getDifference(data.total_donations, prevData.total_donations).changeSymbol),
      createData('Average Donation', `$${data.average_donations?.toFixed(2)}`, true, getDifference(data.average_donations, prevData.average_donations).changeValue, getDifference(data.average_donations, prevData.average_donations).changeSymbol),
      createData('Average Donations Per Person', `$${data.average_donations_per_person?.toFixed(2)}`, true, getDifference(data.average_donations_per_person, prevData.average_donations_per_person).changeValue, getDifference(data.average_donations_per_person, prevData.average_donations_per_person).changeSymbol),
      createData('Top Donator', `${data.top_donator?.donor_name}`, true, getDifference(data.top_donator?.amount, prevData.top_donator?.amount).changeValue, getDifference(data.top_donator?.amount, prevData.top_donator?.amount).changeSymbol),
      createData('Largest Donation', `$${data.largest_donation?.amount} (${data.largest_donation?.donor_name})`, true, getDifference(data.largest_donation?.amount, prevData.largest_donation?.amount).changeValue, getDifference(data.largest_donation?.amount, prevData.largest_donation?.amount).changeSymbol),
    ];
  };

  const customRows = createRows(data, prevData);

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
  const [report, setReport] = useState<IReports | undefined>();
  const [prevReport, setPrevReport] = useState<IReports | undefined>(undefined);
  const [allReports, setAllReports] = useState<IReports[]>([]);
  const [errorMessage, setErrorMessage] = useState(false);
  const [viewingPastReport, setViewingPastReport] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = React.useState(false);
  const handleConfirmationModalOpen = () => setConfirmationModalOpen(true);
  const handleConfirmationModalClose = () => setConfirmationModalOpen(false);
  const [pastReportsModalOpen, setPastReportsModalOpen] = React.useState(false);
  const handlePastReportsModalOpen = () => setPastReportsModalOpen(true);
  const handlePastReportsModalClose = () => setPastReportsModalOpen(false);
  const handleViewingPastReportsOpen = () => setViewingPastReport(true);
  const handleViewingPastReportsClose = () => setViewingPastReport(false);
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

  useEffect(() => {
    if (allReports && allReports.length > 0) {
      const sortedReports = allReports.sort((a, b) => new Date(b.date_generated).getTime() - new Date(a.date_generated).getTime());
      const mostRecentReport = sortedReports[0];
      const secondMostRecentReport = sortedReports[1] || null; 
      setReport(mostRecentReport);
      setPrevReport(secondMostRecentReport);
    }
  }, [allReports]);


  const generateReport = () => {
    setErrorMessage(false);
    const now = dayjs();
    let fiscalYrStart;
    const julyFirstCurrentYear = dayjs().month(6).date(1); 
    if (now.isBefore(julyFirstCurrentYear)) {
      fiscalYrStart = julyFirstCurrentYear.subtract(1, 'year'); 
    } else {
      fiscalYrStart = julyFirstCurrentYear; 
    }
    const lastCalYrReportData = getReportForDateRange(dayjs().startOf('year'), dayjs().endOf('year'));
    const lastFiscalYrReportData = getReportForDateRange(fiscalYrStart, now);
    const last90DaysReportData = getReportForDateRange(now.subtract(90, 'days'), now);
    const last30DaysReportData = getReportForDateRange(now.subtract(30, 'days'), now);
    const allReportData = getReportForDateRange(dayjs('1960-01-01'), now);

    if (allReportData || last30DaysReportData || last90DaysReportData || lastCalYrReportData || lastFiscalYrReportData) {
      const newReportData = {
        last_fiscal: lastFiscalYrReportData,
        last_calendar: lastCalYrReportData,
        last_90: last90DaysReportData,
        last_30: last30DaysReportData,
        last_all: allReportData,
      };
  
      postData('reports/create', newReportData)
      .then((response) => {
        console.log(response);
        setPrevReport(report);
        setReport(response.data);
        setAllReports(prevAllReports => [...prevAllReports, response.data]);
      })
      .catch((error) => { 
        console.log(error); 
      }); 
    } else {
      setErrorMessage(true);
      console.log('could not make a report');
    }
  };

  const handleViewReport = (report: IReports) => {
    setReport(report);
    setPrevReport(allReports.find(r => new Date(r.date_generated).getTime() < new Date(report.date_generated).getTime()) || undefined);
    handlePastReportsModalClose();
    handleViewingPastReportsOpen();
  };

  const handleLoadRecentReport = () => {
    const sortedReports = allReports.sort((a, b) => new Date(b.date_generated).getTime() - new Date(a.date_generated).getTime());
    const mostRecentReport = sortedReports[0];
    const secondMostRecentReport = sortedReports[1] || null; 
    setReport(mostRecentReport);
    setPrevReport(secondMostRecentReport);
    handleViewingPastReportsClose();
  };

  const renderPastReports = () => {
    if (allReports.length === 0) {
      return (
        <Typography sx={{ mt: 2 }}>No past reports available.</Typography>
      );
    }
  
    return (
      <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
        <Table stickyHeader aria-label="past reports table">
          <TableBody>
            {allReports.map((report, index) => (
              <TableRow key={report._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{dayjs(report.date_generated).format('MM/DD/YYYY')}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewReport(report)}
                  >
                    View Report
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };  
  

  return (
    <div>
      <Grid sx={{ m: 4 }} spacing={2}>
        <Grid>
          <Typography variant="h4" gutterBottom>
            Report on {dayjs(report?.date_generated).format('MM/DD/YYYY')}
          </Typography>
        </Grid>
        <Grid container direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item>
            <Box display="flex" gap={2}>
              {viewingPastReport && (
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={handleLoadRecentReport}
                >
                  View Recent Report
                </Button>
              )}
              {!viewingPastReport && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => generateReport()}
                >
                  Generate New Report
                </Button>
              )}
            </Box>
          </Grid>
          <Grid item>
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmationModalOpen}
              >
                Download / Share
              </Button>
              <Button
                variant="contained"
                color="inherit"
                onClick={handlePastReportsModalOpen}
              >
                View Past Reports
              </Button>
            </Box>
          </Grid>
        </Grid>
        {errorMessage && (
          <Typography sx={{ color: 'red', ml: 2 }} variant="body2">
            Error generating the report, please retry.
          </Typography>
        )}
          <Grid sx={{ mt: 2, mb: 2 }}>
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
                Fiscal Yr
              </ToggleButton>
              <ToggleButton value="last_calendar" aria-label="lastCalYr">
                Cal Yr
              </ToggleButton>
              <ToggleButton value="last_90" aria-label="last90Days">
                Last 90 Days
              </ToggleButton>
              <ToggleButton value="last_30" aria-label="last30Days">
                Last 30 Days
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>

        <BasicTable  alignment={alignment} report={report} prevReport={prevReport} />

        <Grid>
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
                width={300}
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
                width={300}
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
        aria-describedby="View Past Reports"
      >
        <Box sx={{ ...style, width: '80%', maxHeight: '80vh', overflow: 'auto' }}>
          <Typography variant="h6" component="h2">
            Past Reports
          </Typography>
          {renderPastReports()}
          <Button onClick={handlePastReportsModalClose}>Close</Button>
        </Box>
      </Modal>
    </div>
  );
}

export default ReportsPage;
