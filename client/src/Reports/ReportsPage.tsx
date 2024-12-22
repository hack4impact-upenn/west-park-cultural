/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-alert */
/* eslint-disable import/no-unresolved */
/* eslint-disable */
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
import FormControl from '@mui/material/FormControl';
import { ArrowUpward, ArrowDownward, Remove } from '@mui/icons-material';
// eslint-disable-next-line import/no-extraneous-dependencies
import html2canvas from 'html2canvas';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
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
  report: ReportData | undefined;
  prevReport: IReports | undefined;
}

interface ReportData {
  total_donated: number | null;
  total_donations: number | null;
  average_donations: number | null;
  average_donations_per_person: number | null;
  top_donator: {
    amount: number | null;
    donor_name: string | null;
    donor_id: string | null;
  } | null;
  largest_donation: {
    amount: number | null;
    donation_id: string | null;
    donor_name: string | null;
    donor_id: string | null;
  } | null;
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

  // const data = getReportData(report, alignment);
  const data = report;
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
          </a>{' '}
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
  const [report, setReport] = useState<ReportData | undefined>();
  const [prevReport, setPrevReport] = useState<IReports | undefined>(undefined);
  const [allReports, setAllReports] = useState<IReports[]>([]);
  const [errorMessage, setErrorMessage] = useState(false);
  const [donations, setDonations] = useState<IDonation[]>([]);
  const [confirmationModalOpen, setConfirmationModalOpen] =
    React.useState(false);
  const handleConfirmationModalOpen = () => setConfirmationModalOpen(true);
  const handleConfirmationModalClose = () => setConfirmationModalOpen(false);
  const [startTimePeriod, setStartTimePeriod] = React.useState<Dayjs | null>(
    dayjs('1999-09-09'),
  );
  const [endTimePeriod, setEndTimePeriod] = React.useState<Dayjs | null>(
    dayjs(),
  );
  const [timefilteredDonations, setTimefilteredDonations] = React.useState<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    IDonation[]
  >([]);

  const allDonations = useData('donation/all');
  const allPurposes = useData('purpose/all');
  const allDonors = useData('donor/all');
  const reports = useData('reports/all');

  useEffect(() => {
    const data = reports?.data || [];
    setAllReports(data);
  }, [reports]);

  useEffect(() => {
    if (allDonations?.data) {
      const data: IDonation[] = allDonations.data as IDonation[];
      setDonations(data);
      // You will see the updated donations in the next effect
      setAlignment('last_all');
    }
  }, [allDonations]);

  const handleTimeInterval = (
    event: React.MouseEvent<HTMLElement>,
    newTimeInterval: string,
  ) => {
    setAlignment(newTimeInterval);
  };

  const updateTimeInterval = () => {
    if (donations) {
      const filteredDonations = donations.filter((donation: any) => {
        const donationDate = dayjs(donation.date);
        const reportDate = dayjs();
        if (alignment === 'last_all') {
          setStartTimePeriod(dayjs('1999-09-09'));
        }
        if (alignment === 'last_30') {
          setStartTimePeriod(dayjs().subtract(30, 'days'));
        }
        if (alignment === 'last_90') {
          setStartTimePeriod(dayjs().subtract(90, 'days'));
        }
        if (alignment === 'last_calendar') {
          setStartTimePeriod(dayjs().startOf('year'));
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
          setStartTimePeriod(fiscalYearStart);
          setEndTimePeriod(fiscalYearEnd);

          return (
            donationDate.isAfter(fiscalYearStart) &&
            donationDate.isBefore(fiscalYearEnd)
          );
        }
        return false;
      });

      setTimefilteredDonations(filteredDonations);
    }
  };

  useEffect(() => {
    updateTimeInterval();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alignment, donations]);

  const generateReport = () => {
    setErrorMessage(false);
    const loadReport = getReportForDateRange(timefilteredDonations);

    if (loadReport) {
      setReport(loadReport as ReportData);
    } else {
      setErrorMessage(true);
    }
  };

  React.useEffect(() => {
    if (donations) {
      if (endTimePeriod?.isAfter(startTimePeriod)) {
        const filteredDonations = donations.filter((donation: IDonation) => {
          const donationDate = dayjs(donation.date);
          const matchesTimePeriod =
            (donationDate.isAfter(startTimePeriod) ||
              donationDate.isSame(startTimePeriod)) &&
            (donationDate.isBefore(endTimePeriod) ||
              donationDate.isSame(endTimePeriod));
          return matchesTimePeriod;
        });
        setTimefilteredDonations(filteredDonations);
      } else {
        setErrorMessage(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTimePeriod, endTimePeriod]);

  React.useEffect(() => {
    if (timefilteredDonations) {
      generateReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timefilteredDonations]);

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
  const [barCampaignData, setBarCampaignData] = React.useState<any[]>([]);
  const [donorGroupData, setDonorGroupData] = React.useState<any[]>([]);
  const [fundraiserData, setFundraiserData] = React.useState<any[]>([]);
  const [fundraiserRawData, setFundraiserRawData] = React.useState<any[]>([]);

  interface SumByType {
    type: string;
    data: number[];
  }

  const genDonorGroupData = () => {
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

    const donoData: IDonation[] = timefilteredDonations;
    const timeseriesdata: number[] = Array(12).fill(0); // Array to hold the total donations for each month
    const timeseriescounts: number[] = Array(12).fill(0); // Array to hold the count of donations for each month
    const timeserieslabels: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    donoData.forEach(
      (donation: { date: string | number | Date; amount: number }) => {
        const donationDate = new Date(donation.date);
        const month = donationDate.getMonth(); // getMonth() returns 0 for January, 1 for February, and so on
        timeseriesdata[month] += donation.amount;
        timeseriescounts[month] += 1;
      },
    );

    const averageDonations = timeseriesdata.map(
      (total, index) => total / (timeseriescounts[index] || 1),
    );
    setDonationByTime(averageDonations);
    setDonationsTimeLabels(timeserieslabels);
  };

  const genPurposeData = () => {
    const purpose_to_id_map: any = {};
    const fundraiserPurposes: any = {};

    if (!(allPurposes?.data && allDonations?.data)) return;
    allPurposes.data.forEach((purpose: { _id: string; name: any }) => {
      // eslint-disable-next-line no-underscore-dangle
      purpose_to_id_map[purpose._id] = purpose.name;

      if (purpose.name.toLowerCase().includes('fundraiser')) {
        fundraiserPurposes[purpose._id] = purpose.name;
      }
    });

    const donationData: IDonation[] = timefilteredDonations;
    let index = 0;
    const purpose_to_count_map: any = {};
    const purpose_to_number_map: any = {};
    const fundraiserCountMap: any = {}; 
    const fundraiserAmountMap: any = {}; 

    donationData.forEach((donation: { purpose_id: any; amount: number }) => {
      if (donation.purpose_id in purpose_to_count_map) {
        purpose_to_count_map[donation.purpose_id] += donation.amount;
        purpose_to_number_map[donation.purpose_id] += 1;
      } else {
        purpose_to_count_map[donation.purpose_id] = donation.amount;
        purpose_to_number_map[donation.purpose_id] = 1;
      }

      if (donation.purpose_id in fundraiserPurposes) {
        if (donation.purpose_id in fundraiserAmountMap) {
          fundraiserAmountMap[donation.purpose_id] += donation.amount;
          fundraiserCountMap[donation.purpose_id] += 1;
        } else {
          fundraiserAmountMap[donation.purpose_id] = donation.amount;
          fundraiserCountMap[donation.purpose_id] = 1;
        }
      }
    });

    const data: any[] = [];
    const fundraiserData: any[] = []; 
    const keys = Object.keys(purpose_to_count_map);
    const campaignLabelsSet: Set<string> = new Set();

    keys.forEach((key) => {
      campaignLabelsSet.add(purpose_to_id_map[key]);
      data.push({
        id: index,
        label: purpose_to_id_map[key],
        value: purpose_to_count_map[key],
        count: purpose_to_number_map[key],
        purpose_id: key,
      });

      if (key in fundraiserPurposes) {
        fundraiserData.push({
          id: index,
          label: purpose_to_id_map[key],
          value: fundraiserAmountMap[key],
          count: fundraiserCountMap[key],
        });
      }
      
      index += 1;
    });
    setBarCampaignData(data);
    
  
    const series = [
      {
        arcLabel: (item: any) => `$${item.value.toFixed(2)}`,
        arcLabelMinAngle: 20,
        data,
        valueFormatter: (value: any) => `$${value.value.toFixed(2)}`,
      },
    ];
    setFundraiserRawData(fundraiserData);
    
    if (fundraiserData.length > 0) {
      const fundraiserSeries = [
        {
          arcLabel: (item: any) => `$${item.value.toFixed(2)}`,
          arcLabelMinAngle: 20,
          data: fundraiserData, // Fix key name to "data"
          valueFormatter: (value: any) => `$${value.value.toFixed(2)}`,
        },
      ];
      setFundraiserData(fundraiserSeries);
    } else {
      setFundraiserData([]);
    }
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
      <div id="report-content" style={{ width: '90%' }}>
        <Grid sx={{ m: 4, width: '100%' }} spacing={2}>
          <Grid>
            <Typography variant="h4" gutterBottom>
              Report on {dayjs().format('MM/DD/YYYY')}
            </Typography>
          </Grid>
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

          <Box sx={{ marginBottom: 1 }}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Time Period"
                  value={startTimePeriod}
                  onChange={(newValue) => setStartTimePeriod(newValue)}
                  sx={{ marginBottom: 1 }}
                />
                <DatePicker
                  label="End Time Period"
                  value={endTimePeriod}
                  onChange={(newValue) => setEndTimePeriod(newValue)}
                />
              </LocalizationProvider>
            </FormControl>
          </Box>

          <BasicTable
            alignment={alignment}
            report={report}
            prevReport={prevReport}
          />

          {errorMessage && (
            <Typography sx={{ color: 'red', ml: 2 }} variant="body2">
              Loading report...
            </Typography>
          )}

          <Grid
            container
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            sx={{ marginTop: 1 }}
          >
            <Grid item>
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleConfirmationModalOpen}
                >
                  Download / Share
                </Button>
              </Box>
            </Grid>
          </Grid>
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
                  Donation Breakdown
                </Typography>
                <PieChart
                  series={purposeData}
                  height={200}
                  // width={800}
                  slotProps={{
                    legend: {
                      hidden: false
                    },
                  }}
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
                  width: '100%',
                }}
              >
                <Typography variant="h6" align="center">
                  Fundraiser Breakdown
                </Typography>
                {fundraiserRawData.length > 0 ? (
                <BarChart
                  width={500}
                  height={300}
                  series={[
                    { data: fundraiserRawData.map((item) => item.count), label: 'count', id: 'count' },
                  ]}
                  xAxis={[{ data: fundraiserRawData.map((item) => item.label), scaleType: 'band' }]}
                />
              ) : (
                <Typography variant="body2" align="center">
                  Loading data...
                </Typography>
              )}

              {fundraiserRawData.length > 0 ? (
                <BarChart
                  width={500}
                  height={300}
                  series={[
                    { data: fundraiserRawData.map((item) => item.value), label: 'amount ($)', id: 'amount' },
                  ]}
                  xAxis={[{ data: fundraiserRawData.map((item) => item.label), scaleType: 'band' }]}
                />
              ) : (
                <Typography variant="body2" align="center">
                  Loading data...
                </Typography>
              )}
              
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
                  Average Donations by Month
                </Typography>
                <Typography variant="body2" align="center">
                  Average amount of donation per month.
                </Typography>
                <LineChart
                  xAxis={[
                    {
                      data: donationsTimeLabels,
                    },
                  ]}
                  series={[
                    {
                      data: donationByTime,
                      valueFormatter: (value: number) => {
                        if (!value || Number.isNaN(value)) {
                          return '$0.00'; // Handle undefined, null, or NaN values
                        }
                        return `$${value.toFixed(2)}`; // Format the number to two decimal places
                      },
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
                  Type Breakdown
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
                  Donations by Campaigns ($)
                </Typography>
                {barCampaignData.length > 0 ? (
                <BarChart
                  width={500}
                  height={300}
                  series={[
                    { data: barCampaignData.map((item) => item.value), label: 'amount ($)', id: '$' },
                  ]}
                  xAxis={[{ data: barCampaignData.map((item) => item.label), scaleType: 'band' }]}
                />
              ) : (
                <Typography variant="body2" align="center">
                  Loading data...
                </Typography>
              )}

{barCampaignData.length > 0 ? (
                <BarChart
                  width={500}
                  height={300}
                  series={[
                    { data: barCampaignData.map((item) => item.count), label: 'count', id: 'count' },
                  ]}
                  xAxis={[{ data: barCampaignData.map((item) => item.label), scaleType: 'band' }]}
                />
              ) : (
                <Typography variant="body2" align="center">
                  Loading data...
                </Typography>
              )}
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
      </div>
    </div>
  );
}

export default ReportsPage;
