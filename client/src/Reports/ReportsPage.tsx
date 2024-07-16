/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-shadow */
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
// TODO: check if fixed
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  PieChart,
  LineChart,
  BarChart,
  pieArcLabelClasses,
} from '@mui/x-charts';
import { ArrowUpward, ArrowDownward, Remove } from '@mui/icons-material';
import dayjs from 'dayjs';
// eslint-disable-next-line import/no-extraneous-dependencies
import html2canvas from 'html2canvas';
// eslint-disable-next-line import/no-extraneous-dependencies
import jsPDF from 'jspdf';
import { useData, postData } from '../util/api';
import useDonationStatistics from './useDonationStatistics';
import IReports from '../util/types/reports';
import IDonation from '../util/types/donation';
import DonationsTable from '../components/tables/DonationsTable';
import DonorsTable from '../components/tables/DonorsTable';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function createData(
  title: string,
  value: any,
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
  // eslint-disable-next-line @typescript-eslint/no-shadow
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

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const createRows = (data: any, prevData: any) => {
    if (!data) {
      return [
        createData('Total Donated', 'No report data', false, '', false),
        createData('Total Donations', 'No report data', false, '', false),
        createData('Average Donation', 'No report data', false, '', false),
        createData(
          'Average Donations Per Person',
          'No report data',
          false,
          '',
          false,
        ),
        createData('Top Donor', 'No report data', false, '', false),
        createData('Largest Donation', 'No report data', false, '', false),
      ];
    }

    if (!prevData) {
      return [
        createData('Total Donated', `$${data.total_donated}`, false, '', false),
        createData(
          'Total Donations',
          `${data.total_donations}`,
          false,
          '',
          false,
        ),
        createData(
          'Average Donation',
          `$${data.average_donations?.toFixed(2)}`,
          false,
          '',
          false,
        ),
        createData(
          'Average Donations Per Person',
          `$${data.average_donations_per_person?.toFixed(2)}`,
          false,
          '',
          false,
        ),
        createData(
          'Top Donor',
          <a
            href={`/donationInfo/${data.top_donator?.donor_id}`}
            style={{ textDecoration: 'none', color: '#0883ff' }}
          >
            {data.top_donator?.donor_name}
          </a>,
          false,
          '',
          false,
        ),
        createData(
          'Largest Donation',
          `$${data.largest_donation?.amount} (${data.largest_donation?.donor_name})`,
          false,
          '',
          false,
        ),
      ];
    }

    return [
      createData(
        'Total Donated',
        `$${data.total_donated}`,
        true,
        getDifference(data.total_donated, prevData.total_donated).changeValue,
        getDifference(data.total_donated, prevData.total_donated).changeSymbol,
      ),
      createData(
        'Total Donations',
        `${data.total_donations}`,
        true,
        getDifference(data.total_donations, prevData.total_donations)
          .changeValue,
        getDifference(data.total_donations, prevData.total_donations)
          .changeSymbol,
      ),
      createData(
        'Average Donation',
        `$${data.average_donations?.toFixed(2)}`,
        true,
        getDifference(data.average_donations, prevData.average_donations)
          .changeValue,
        getDifference(data.average_donations, prevData.average_donations)
          .changeSymbol,
      ),
      createData(
        'Average Donations Per Person',
        `$${data.average_donations_per_person?.toFixed(2)}`,
        true,
        getDifference(
          data.average_donations_per_person,
          prevData.average_donations_per_person,
        ).changeValue,
        getDifference(
          data.average_donations_per_person,
          prevData.average_donations_per_person,
        ).changeSymbol,
      ),
      createData(
        'Top Donor',
        <a
          href={`/donor-profile/${data.top_donator?.donor_id}`}
          style={{ textDecoration: 'none', color: '#0883ff' }}
        >
          {data.top_donator?.donor_name}
        </a>,
        true,
        getDifference(data.top_donator?.amount, prevData.top_donator?.amount)
          .changeValue,
        getDifference(data.top_donator?.amount, prevData.top_donator?.amount)
          .changeSymbol,
      ),
      createData(
        'Largest Donation',
        <span>
          <a
            href={`/donor-profile/${data.top_donator?.donor_id}`}
            style={{ textDecoration: 'none', color: '#0883ff' }}
          >
            {data.top_donator?.donor_name}
          </a>
          (
          <a
            href={`/donationInfo/${data.largest_donation?.donation_id}`}
            style={{ textDecoration: 'none', color: '#0883ff' }}
          >
            ${data.largest_donation?.amount}
          </a>
          )
        </span>,
        // `$${data.largest_donation?.amount} (${data.largest_donation?.donor_name})`,
        true,
        getDifference(
          data.largest_donation?.amount,
          prevData.largest_donation?.amount,
        ).changeValue,
        getDifference(
          data.largest_donation?.amount,
          prevData.largest_donation?.amount,
        ).changeSymbol,
      ),
    ];
  };

  const customRows = createRows(data, prevData);

  return (
    <TableContainer component={Paper}>
      <Table sx={{}} aria-label="report table">
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
  const { getReportForDateRange } = useDonationStatistics();

  const [alignment, setAlignment] = useState('last_all');
  const [report, setReport] = useState<IReports | undefined>();
  const [prevReport, setPrevReport] = useState<IReports | undefined>(undefined);
  const [allReports, setAllReports] = useState<IReports[]>([]);
  const [errorMessage, setErrorMessage] = useState(false);
  const [viewingPastReport, setViewingPastReport] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] =
    React.useState(false);
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
      const sortedReports = allReports.sort(
        (a, b) =>
          new Date(b.date_generated).getTime() -
          new Date(a.date_generated).getTime(),
      );
      const mostRecentReport = sortedReports[0];
      const secondMostRecentReport = sortedReports[1] || null;
      setReport(mostRecentReport);
      setPrevReport(secondMostRecentReport);
    }
  }, [allReports]);

  const generateReport = () => {
    setErrorMessage(false);
    const now = dayjs();
    const lastFiscalYrReportData = getReportForDateRange(
      dayjs().month(6).startOf('month'),
      now,
    );
    const lastCalYrReportData = getReportForDateRange(
      dayjs().startOf('year'),
      now,
    );
    const last90DaysReportData = getReportForDateRange(
      now.subtract(90, 'days'),
      now,
    );
    const last30DaysReportData = getReportForDateRange(
      now.subtract(30, 'days'),
      now,
    );
    const allReportData = getReportForDateRange(dayjs('1960-01-01'), now);

    if (
      allReportData ||
      last30DaysReportData ||
      last90DaysReportData ||
      lastCalYrReportData ||
      lastFiscalYrReportData
    ) {
      const newReportData = {
        last_fiscal: lastFiscalYrReportData,
        last_calendar: lastCalYrReportData,
        last_90: last90DaysReportData,
        last_30: last30DaysReportData,
        last_all: allReportData,
      };

      postData('reports/create', newReportData)
        .then((response) => {
          // console.log(response);
          setPrevReport(report);
          setReport(response.data);
          setAllReports((prevAllReports) => [...prevAllReports, response.data]);
        })
        .catch((error) => {
          // console.log(error);
        });
    } else {
      setErrorMessage(true);
      console.log('could not make a report');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleViewReport = (report: IReports) => {
    setReport(report);
    setPrevReport(
      allReports.find(
        (r) =>
          new Date(r.date_generated).getTime() <
          new Date(report.date_generated).getTime(),
      ) || undefined,
    );
    handlePastReportsModalClose();
    handleViewingPastReportsOpen();
  };

  const handleLoadRecentReport = () => {
    const sortedReports = allReports.sort(
      (a, b) =>
        new Date(b.date_generated).getTime() -
        new Date(a.date_generated).getTime(),
    );
    const mostRecentReport = sortedReports[0];
    const secondMostRecentReport = sortedReports[1] || null;
    setReport(mostRecentReport);
    setPrevReport(secondMostRecentReport);
    handleViewingPastReportsClose();
  };

  const allDonations = useData('donation/all');
  const allPurposes = useData('purpose/all');
  const allDonors = useData('donor/all');

  const [timefilteredDonations, setTimefilteredDonations] = React.useState<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    IDonation[]
  >([]);

  React.useEffect(() => {
    if (allDonations?.data) {
      // console.log('allDonations', allDonations.data);
      const donations = allDonations.data;
      const filteredDonations = donations.filter((donation: any) => {
        const donationDate = dayjs(donation.date);
        const reportDate = dayjs(report?.date_generated);
        if (alignment === 'last_all') {
          return true;
        }
        if (alignment === 'last_30') {
          return donationDate.isAfter(reportDate.subtract(30, 'days'));
        }
        if (alignment === 'last_90') {
          return donationDate.isAfter(reportDate.subtract(90, 'days'));
        }
        if (alignment === 'last_calendar') {
          return donationDate.isSame(reportDate, 'year');
        }

        if (alignment === 'last_fiscal') {
          const fiscalYearStart =
            reportDate.month() >= 6
              ? reportDate.startOf('year').month(6).startOf('month') // July 1st of the same year
              : reportDate
                  .startOf('year')
                  .subtract(1, 'year')
                  .month(6)
                  .startOf('month'); // July 1st of the previous year

          const fiscalYearEnd = fiscalYearStart.add(1, 'year');

          return (
            donationDate.isAfter(fiscalYearStart) &&
            donationDate.isBefore(fiscalYearEnd)
          );
        }
        return false;
      });
      setTimefilteredDonations(filteredDonations);
    }
  }, [alignment, allDonations, report]);

  const [purposeData, setPurposeData] = React.useState<any[]>([
    {
      data: [],
    },
  ]);

  const [donationByTime, setDonationByTime] = React.useState<any[]>([]);
  const [donationsTimeLabels, setDonationsTimeLabels] = React.useState<any[]>(
    [],
  );

  const [donorGroupLabels, setDonorGroupLabels] = React.useState<any[]>([]);
  const [donorGroupData, setDonorGroupData] = React.useState<any[]>([]);

  interface SumByType {
    type: string;
    data: number[];
  }

  const genDonorGroupData = () => {
    // console.log(timefilteredDonations);
    if (!timefilteredDonations || !allDonors?.data) return;

    const donations: IDonation[] = timefilteredDonations as IDonation[];
    const donors = allDonors.data;
    // Create a map to quickly lookup donor_group by donor_id
    const donorGroupMap = new Map<string, string>();
    donors.forEach((donor: { _id: string; donor_group: string }) => {
      // eslint-disable-next-line no-underscore-dangle
      donorGroupMap.set(donor._id, donor.donor_group);
    });

    // Create a map to store unique donor_groups and their indices
    const donorGroupIndices = new Map<string, number>();
    let index = 0;
    donations.forEach((donation: { donor_id: string }) => {
      const donorGroup = donorGroupMap.get(donation.donor_id);
      if (donorGroup && !donorGroupIndices.has(donorGroup)) {
        // eslint-disable-next-line no-plusplus
        donorGroupIndices.set(donorGroup, index++);
      }
    });

    // Create uniq_groups array
    const uniq_groups = Array.from(donorGroupIndices.keys());

    // Create a map to store sums by type and donor_group index
    const sumsByType = new Map<string, number[]>();
    donations.forEach(
      (donation: { donor_id: string; type: string; amount: number }) => {
        const donorGroup = donorGroupMap.get(donation.donor_id);
        if (donorGroup) {
          const groupIndex = donorGroupIndices.get(donorGroup);
          if (groupIndex !== undefined) {
            if (!sumsByType.has(donation.type)) {
              sumsByType.set(
                donation.type,
                new Array(uniq_groups.length).fill(0),
              );
            }
            sumsByType.get(donation.type)![groupIndex] += donation.amount;
          }
        }
      },
    );

    // Create the array of objects representing sums by type
    const sumByTypeArray: SumByType[] = Array.from(sumsByType.entries()).map(
      ([type, data]) => ({
        type,
        data,
      }),
    );

    setDonorGroupLabels(uniq_groups);
    const finalData: any[] = [];
    sumByTypeArray.forEach((sumByType) => {
      finalData.push({
        data: sumByType.data,
        // make first letter uppercase and add "s" to the end of the label
        label:
          // eslint-disable-next-line prefer-template
          sumByType.type.charAt(0).toUpperCase() +
          sumByType.type.slice(1) +
          's',
        valueFormatter: (value: number) => `$${value.toFixed(2)}`,
      });
    });
    setDonorGroupData(finalData);
  };

  const genDonationByTimeData = () => {
    if (!timefilteredDonations) return;
    {
      const donoData: IDonation[] = timefilteredDonations;
      const timeseriesdata: number[] = [];
      const timeserieslabels: number[] = [];

      // Sort donations by date
      const sortedData = donoData.sort(
        (
          a: { date: string | number | Date },
          b: { date: string | number | Date },
        ) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        },
      );
      // console.log(sortedData);
      if (sortedData.length > 0) {
        const startDate = new Date(sortedData[0].date);
        const endDate = new Date(sortedData[sortedData.length - 1].date);
        const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        // Determine the number of groups (at most 10)
        const numGroups = Math.min(10, sortedData.length);
        const groupSize = Math.ceil(diffDays / numGroups);

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < numGroups; i++) {
          const groupStartDate = new Date(
            startDate.getTime() + i * groupSize * 24 * 60 * 60 * 1000,
          );
          const groupEndDate = new Date(
            groupStartDate.getTime() + groupSize * 24 * 60 * 60 * 1000,
          );

          let total = 0;
          sortedData.forEach(
            (donation: { date: string | number | Date; amount: number }) => {
              const donationDate = new Date(donation.date);
              if (
                donationDate >= groupStartDate &&
                donationDate < groupEndDate
              ) {
                total += donation.amount;
              }
            },
          );
          timeseriesdata.push(total);
          timeserieslabels.push(i + 1);
        }
        setDonationByTime(timeseriesdata);
        setDonationsTimeLabels(timeserieslabels);
      }
    }
  };

  const genPurposeData = () => {
    const purpose_to_id_map: any = {};
    if (!(allPurposes?.data && allDonations?.data)) return;
    allPurposes.data.forEach((purpose: { _id: string; name: any }) => {
      // eslint-disable-next-line no-underscore-dangle
      purpose_to_id_map[purpose._id] = purpose.name;
    });

    const donationData: IDonation[] = timefilteredDonations;
    let index = 0;
    const purpose_to_count_map: any = {};
    donationData.forEach((donation: { purpose_id: any; amount: number }) => {
      if (donation.purpose_id in purpose_to_count_map) {
        purpose_to_count_map[donation.purpose_id] += donation.amount;
      } else {
        purpose_to_count_map[donation.purpose_id] = donation.amount;
      }
    });

    const data: any[] = [];
    const keys = Object.keys(purpose_to_count_map);
    keys.forEach((key) => {
      data.push({
        id: index,
        label: purpose_to_id_map[key],
        value: purpose_to_count_map[key],
        purpose_id: key,
      });
      index += 1;
    });

    const series = [
      {
        arcLabel: (item: any) => `$${item.value.toFixed(2)}`,
        arcLabelMinAngle: 20,
        data,
        valueFormatter: (value: any) => `$${value.value.toFixed(2)}`,
      },
    ];

    setPurposeData(series);
  };

  React.useEffect(() => {
    if (allDonations?.data && allPurposes?.data) {
      genPurposeData();
      genDonationByTimeData();

      if (allDonors?.data) {
        genDonorGroupData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report, allDonations, allPurposes, alignment, timefilteredDonations]);

  const renderPastReports = () => {
    if (allReports.length === 0) {
      return <Typography sx={{ mt: 2 }}>No past reports available.</Typography>;
    }

    return (
      <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
        <Table stickyHeader aria-label="past reports table">
          <TableBody>
            {allReports.map((report, index) => (
              // eslint-disable-next-line no-underscore-dangle
              <TableRow key={report._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {dayjs(report.date_generated).format('MM/DD/YYYY')}
                </TableCell>
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

  const downloadPDF = () => {
    // eslint-disable-next-line new-cap
    const doc = new jsPDF();
    const element: HTMLElement = document.getElementById(
      'report-content',
    ) as HTMLElement;
    const hiddenElement: HTMLElement = document.getElementById(
      'hiddenDataForFileDownload',
    ) as HTMLElement;

    // Temporarily make hidden content visible but off-screen
    hiddenElement.style.display = 'block';
    hiddenElement.style.visibility = 'visible';
    hiddenElement.style.position = 'absolute';
    hiddenElement.style.left = '-9999px';

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;
      doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      html2canvas(hiddenElement).then((hiddenCanvas) => {
        const hiddenImgData = hiddenCanvas.toDataURL('image/png');
        const hiddenImgHeight =
          (hiddenCanvas.height * imgWidth) / hiddenCanvas.width;
        let hiddenHeightLeft = hiddenImgHeight;
        let hiddenPosition = 0;

        doc.addPage();
        doc.addImage(
          hiddenImgData,
          'PNG',
          10,
          hiddenPosition,
          imgWidth,
          hiddenImgHeight,
        );
        hiddenHeightLeft -= pageHeight;

        while (hiddenHeightLeft >= 0) {
          hiddenPosition = hiddenHeightLeft - hiddenImgHeight;
          doc.addPage();
          doc.addImage(
            hiddenImgData,
            'PNG',
            10,
            hiddenPosition,
            imgWidth,
            hiddenImgHeight,
          );
          hiddenHeightLeft -= pageHeight;
        }

        // Hide the hidden content again
        hiddenElement.style.display = 'none';

        doc.save('report.pdf');
      });
    });
  };

  const handleConfirmDownload = () => {
    downloadPDF();
    handleConfirmationModalClose();
  };

  return (
    <div className="max-width-wrapper">
      <div id="report-content" style={{ width: '100%' }}>
        <Grid sx={{ m: 4, width: '100%' }} spacing={2}>
          <Grid>
            <Typography variant="h4" gutterBottom>
              Report on {dayjs(report?.date_generated).format('MM/DD/YYYY')}
            </Typography>
          </Grid>
          <Grid
            container
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
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
                Current Fiscal Yr
              </ToggleButton>
              <ToggleButton value="last_calendar" aria-label="lastCalYr">
                Current Cal Yr
              </ToggleButton>
              <ToggleButton value="last_90" aria-label="last90Days">
                Last 90 Days
              </ToggleButton>
              <ToggleButton value="last_30" aria-label="last30Days">
                Last 30 Days
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          <BasicTable
            alignment={alignment}
            report={report}
            prevReport={prevReport}
          />

          {/* <Grid item xs={12}>
          
        </Grid> */}

          <Grid sx={{ mt: 4, width: '100%' }}>
            <Stack direction="column" spacing={2} sx={{ width: '100%' }}>
              <Box
                sx={{
                  boxShadow: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2,
                  width: '100%',
                }}
              >
                <Typography variant="h6" align="center">
                  Purpose Breakdown
                </Typography>
                <PieChart
                  series={purposeData}
                  height={200}
                  // width={800}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: 'white',
                      fontWeight: 'bold',
                      fontSize: 11,
                      // width: '500px',
                    },
                  }}
                />
              </Box>
              <Box
                sx={{
                  boxShadow: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2,
                }}
              >
                <Typography variant="h6" align="center">
                  Donations over Time
                </Typography>
                <Typography variant="body2" align="center">
                  Donations are split into at most 10 equal time intervals.
                </Typography>
                <LineChart
                  xAxis={[
                    {
                      data: donationsTimeLabels,
                      // valueFormatter: (value) =>
                      //   // context.location === 'tick' ? 'code' : `May`,
                      //   // 'may',
                      //   value,
                    },
                  ]}
                  series={[
                    {
                      data: donationByTime,
                      valueFormatter: (value: number) => `$${value.toFixed(2)}`,
                    },
                  ]}
                  width={500}
                  height={300}
                />
              </Box>

              <Box
                sx={{
                  boxShadow: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2,
                  mt: 4,
                }}
              >
                <Typography variant="h6" align="center">
                  Donation Breakdown
                </Typography>
                <BarChart
                  xAxis={[
                    {
                      scaleType: 'band',
                      data: donorGroupLabels,
                    },
                  ]}
                  series={donorGroupData}
                  width={500}
                  height={300}
                />
              </Box>
            </Stack>
          </Grid>
          <div id="hiddenDataForFileDownload" style={{ display: 'none' }}>
            <Typography
              variant="h3"
              align="center"
              style={{ marginBottom: '30px' }}
            >
              All Donations
            </Typography>
            <DonationsTable alignment="all" />
            <Typography
              variant="h3"
              align="center"
              style={{ marginBottom: '30px', marginTop: '50px' }}
            >
              All Donors
            </Typography>
            <DonorsTable alignment="all" />
          </div>
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
            <Button onClick={handleConfirmDownload}>Confirm</Button>
          </Box>
        </Modal>

        <Modal
          open={pastReportsModalOpen}
          onClose={handlePastReportsModalClose}
          aria-labelledby="Past Reports Modal"
          aria-describedby="View Past Reports"
        >
          <Box
            sx={{ ...style, width: '80%', maxHeight: '80vh', overflow: 'auto' }}
          >
            <Typography variant="h6" component="h2">
              Past Reports
            </Typography>
            {renderPastReports()}
            <Button onClick={handlePastReportsModalClose}>Close</Button>
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default ReportsPage;
