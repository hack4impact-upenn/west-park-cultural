import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import IDonor from '../util/types/donor';
import { useData } from '../util/api';

interface BasicDonationStat {
  amount: number;
  count: number;
}

interface DonationStats {
  totalDonationAmount: BasicDonationStat;
  avDonationPerFiscal: BasicDonationStat;
  avDonationPerCalendar: BasicDonationStat;
  donationThirtyDays: BasicDonationStat;
  recentDonation: any;
}

interface PopupPageProps {
  open: boolean;
  onClose: () => void;
  donorID: string;
}

function PopupPage({ open, onClose, donorID }: PopupPageProps) {
  // const donations = useData(`donation/donor/${donorID}`);
  const [donorData, setDonorData] = useState<IDonor | null>(null);
  const [donationsData, setDonationsData] = useState<any>([]);
  const [donationsStats, setDonationsStats] = useState<DonationStats>();
  const [purposeID, setPurposeID] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);

  const purposes = useData('purpose');
  const [purposesData, setPurposesData] = useState<PurposeType[]>([]);

  useEffect(() => {
    const data = purposes?.data || [];
    setPurposesData(data);
  }, [purposes]);

  useEffect(() => {
    const fetchDonor = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:4000/api/donor/id/${donorID}`,
        );
        setDonorData(res.data);
      } catch (error) {
        console.error('Failed to fetch donor:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchDonor();
    }
  }, [donorID, open]);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/donation/donor/${donorID}`,
        );
        setDonationsData(res.data);
      } catch (error) {
        console.error('Failed to fetch donation:', error);
      } 
    };
    if (open) {
      fetchDonations();
    }
  }, [donorID, open]);

  // useEffect(() => {
  //   const data = donations?.data || [];
  //   setDonationsData(data);
  // }, [donations?.data, donations]);

  useEffect(() => {
    const calculateDonationStats = (data: any) => {
      if (data.length) {
        const totalDonationAmount = data.reduce(
          (total: number, donation: any) => total + donation.amount,
          0,
        );

        let fiscalYearStart: Date;
        let fiscalYearEnd: Date;

        const currentDate = new Date();

        if (currentDate.getMonth() < 6) {
          fiscalYearStart = new Date(currentDate.getFullYear() - 1, 6, 1);
          fiscalYearEnd = new Date(currentDate.getFullYear(), 5, 30);
        } else {
          fiscalYearStart = new Date(currentDate.getFullYear(), 6, 1);
          fiscalYearEnd = new Date(currentDate.getFullYear() + 1, 5, 30);
        }

        const fiscalYearDonations = data.filter((donation: any) => {
          const donationDate = new Date(donation.date);
          return (
            donationDate >= fiscalYearStart && donationDate <= fiscalYearEnd
          );
        });

        const totalFiscalYearDonationAmount = fiscalYearDonations.reduce(
          (total: number, donation: any) => total + donation.amount,
          0,
        );

        const avDonationPerFiscal: BasicDonationStat = {
          amount: fiscalYearDonations.length
            ? Number(
                (
                  totalFiscalYearDonationAmount / fiscalYearDonations.length
                ).toFixed(2),
              )
            : 0,
          count: fiscalYearDonations.length,
        };

        const calendarYearStart = new Date(currentDate.getFullYear(), 0, 1);
        const calendarYearEnd = new Date(currentDate.getFullYear(), 11, 31);

        const calendarYearDonations = data.filter((donation: any) => {
          const donationDate = new Date(donation.date);
          return (
            donationDate >= calendarYearStart && donationDate <= calendarYearEnd
          );
        });

        const totalCalendarYearDonationAmount = calendarYearDonations.reduce(
          (total: number, donation: any) => total + donation.amount,
          0,
        );

        const avDonationPerCalendar: BasicDonationStat = {
          amount: calendarYearDonations.length
            ? +(
                totalCalendarYearDonationAmount / calendarYearDonations.length
              ).toFixed(2)
            : 0,
          count: calendarYearDonations.length,
        };

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const donationsLast30Days = data.filter(
          (donation: any) => new Date(donation.date) > thirtyDaysAgo,
        );
        const donationsAmount30 = donationsLast30Days.reduce(
          (total: number, donation: any) => total + donation.amount,
          0,
        );
        const donationCountLast30Days = donationsLast30Days.length;

        const donationThirtyDays: BasicDonationStat = {
          amount: donationsAmount30,
          count: donationCountLast30Days,
        };

        const mostRecentDonation = data.reduce(
          (mostRecent: any, donation: any) => {
            const donationDate = new Date(donation.date);
            if (!mostRecent || donationDate > new Date(mostRecent.date)) {
              return donation;
            }
            return mostRecent;
          },
          null,
        );

        setPurposeID(mostRecentDonation.purpose_id || '');
        const purposeObject = purposesData.find(
          // eslint-disable-next-line no-underscore-dangle
          (p) => p._id === mostRecentDonation.purpose_id,
        );

        setPurpose(
          purposeObject && purposeObject.name ? purposeObject.name : '',
        );

        const stats: DonationStats = {
          totalDonationAmount: {
            amount: totalDonationAmount,
            count: data.length,
          },
          avDonationPerFiscal,
          avDonationPerCalendar,
          donationThirtyDays,
          recentDonation: {
            amount: mostRecentDonation.amount,
            date: mostRecentDonation.date,
          },
        };
        setDonationsStats(stats);
      }
    };

    if (donationsData.length > 0) {
      calculateDonationStats(donationsData);
    } else {
      setDonationsStats({
        totalDonationAmount: { amount: 0, count: 0 },
        avDonationPerFiscal: { amount: 0, count: 0 },
        avDonationPerCalendar: { amount: 0, count: 0 },
        donationThirtyDays: { amount: 0, count: 0 },
        recentDonation: { amount: 0, date: 'no history' },
      });
      setPurpose('no history');
    }
  }, [donationsData, purposesData]);

  useEffect(() => {
    if (!open) {
      setDonorData(null);
      setDonationsData([]);
      setDonationsStats(undefined);
      setPurpose('');
      setPurposeID('');
    }
  }, [open]);

  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <Typography variant="h6">{`${donorData?.contact_name}'s Donation Summary`}</Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {(loading || !donationStats ? (
            <Typography>Loading...</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Total Donation Amount</TableCell>
                    <TableCell>
                      {donationsStats?.totalDonationAmount.count > 0
                        ? `$${donationsStats.totalDonationAmount.amount}`
                        : 'no history'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Average Donation (Fiscal)</TableCell>
                    <TableCell>
                      {donationsStats?.avDonationPerFiscal.count > 0
                        ? `$${donationsStats.avDonationPerFiscal.amount}`
                        : 'no history'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Average Donation (Calendar)</TableCell>
                    <TableCell>
                      {donationsStats?.avDonationPerCalendar.count > 0
                        ? `$${donationsStats.avDonationPerCalendar.amount}`
                        : 'no history'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Average Donation (Past 30 Days)</TableCell>
                    <TableCell>
                      {donationsStats?.donationThirtyDays.count > 0
                        ? `$${donationsStats.donationThirtyDays.amount}`
                        : 'no history'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Recent Donation</TableCell>
                    <TableCell>
                      {donationsStats?.recentDonation.amount > 0
                        ? `$${donationsStats.recentDonation.amount}`
                        : 'no history'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Recent Campaign</TableCell>
                    <TableCell>{purpose}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

interface PurposeType {
  inputValue?: string;
  title?: string;
  _id?: string;
  name?: string;
  date_created?: Date;
}

export default PopupPage;
