/* eslint-disable no-underscore-dangle */
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
} from '@mui/material';
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

function PopupPage() {
  const [openPopup, setOpenPopup] = useState(false);

  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const donorID = '65daa67d6c34e8adb9f2d2c4';
  const donations = useData(`donation/donor/${donorID}`);
  const donor = useData(`donor/${donorID}`);
  const [donorData, setDonatorData] = useState<IDonor | null>(null);
  const [donationsData, setDonationsData] = useState<any>([]);
  const [donationsStats, setDonationsStats] = useState<DonationStats>();
  const [purposeID, setPurposeID] = useState('');
  const [purpose, setPurpose] = useState('');

  const purposes = useData('purpose');
  const [purposesData, setPurposesData] = useState<PurposeType[]>([]);

  useEffect(() => {
    const data = purposes?.data || [];
    setPurposesData(data);
  }, [purposes]);

  useEffect(() => {
    const data = donor?.data || null;
    setDonatorData(data);
    console.log(data);
  }, [donor]);

  useEffect(() => {
    const data = donations?.data || [];
    setDonationsData(data);
  }, [donations?.data, donations]);

  useEffect(() => {
    const calculateDonationStats = (data: any) => {
      if (data.length) {
        // Calculate Total Donation Amount
        const totalDonationAmount = data.reduce(
          (total: number, donation: any) => total + donation.amount,
          0,
        );

        // Get the current date
        let fiscalYearStart: Date;
        let fiscalYearEnd: Date;

        const currentDate = new Date();

        if (currentDate.getMonth() < 6) {
          // If the current date is before July 1, the fiscal year starts on July 1 of the previous year
          fiscalYearStart = new Date(currentDate.getFullYear() - 1, 6, 1);
          fiscalYearEnd = new Date(currentDate.getFullYear(), 5, 30);
        } else {
          // If the current date is on or after July 1, the fiscal year starts on July 1 of the current year
          fiscalYearStart = new Date(currentDate.getFullYear(), 6, 1);
          fiscalYearEnd = new Date(currentDate.getFullYear() + 1, 5, 30);
        }

        // Filter out the donations that were made during the current fiscal year
        const fiscalYearDonations = data.filter((donation: any) => {
          const donationDate = new Date(donation.date);
          return (
            donationDate >= fiscalYearStart && donationDate <= fiscalYearEnd
          );
        });

        // Calculate the total amount of donations made during the current fiscal year
        const totalFiscalYearDonationAmount = fiscalYearDonations.reduce(
          (total: number, donation: any) => total + donation.amount,
          0,
        );

        // Calculate the average donation per fiscal year
        const avDonationPerFiscal: BasicDonationStat = {
          amount: fiscalYearDonations.length
            ? totalFiscalYearDonationAmount / fiscalYearDonations.length
            : 0,
          count: fiscalYearDonations.length,
        };

        // Define the start and end dates of the current calendar year
        const calendarYearStart = new Date(currentDate.getFullYear(), 0, 1);
        const calendarYearEnd = new Date(currentDate.getFullYear(), 11, 31);

        // Filter out the donations that were made during the current calendar year
        const calendarYearDonations = donationsData.filter((donation: any) => {
          const donationDate = new Date(donation.date);
          return (
            donationDate >= calendarYearStart && donationDate <= calendarYearEnd
          );
        });

        // Calculate the total amount of donations made during the current calendar year
        const totalCalendarYearDonationAmount = calendarYearDonations.reduce(
          (total: number, donation: any) => total + donation.amount,
          0,
        );

        // Calculate the average donation per calendar year
        const avDonationPerCalendar: BasicDonationStat = {
          amount: calendarYearDonations.length
            ? +(
                totalCalendarYearDonationAmount / calendarYearDonations.length
              ).toFixed(2)
            : 0,
          count: calendarYearDonations.length,
        };

        // Calculate Donation (in past 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const donationsLast30Days = donationsData.filter(
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

        // Find the most recent donation
        const mostRecentDonation = donationsData.reduce(
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
          (p) => p._id === mostRecentDonation.purpose_id,
        );

        setPurpose(
          purposeObject && purposeObject.name ? purposeObject.name : '',
        );

        const stats: DonationStats = {
          totalDonationAmount: {
            amount: totalDonationAmount,
            count: donationsData.length,
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
    }
  }, [donationsData, purposesData]);

  return (
    <div>
      <Button onClick={handleOpenPopup}>Popup 1</Button>

      {/* Popup */}
      <Dialog open={openPopup} onClose={handleClosePopup}>
        <DialogTitle> {donorData?.contact_name} Summary </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Total Donation Amount</TableCell>
                  <TableCell>
                    ${donationsStats?.totalDonationAmount.amount}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Average Donation (Fiscal)</TableCell>
                  <TableCell>
                    ${donationsStats?.avDonationPerFiscal.amount}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Average Donation (Calendar)</TableCell>
                  <TableCell>
                    ${donationsStats?.avDonationPerCalendar.amount}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Average Donation (Past 30 Days)</TableCell>
                  <TableCell>
                    ${donationsStats?.donationThirtyDays.amount}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Recent Donation</TableCell>
                  <TableCell>
                    ${donationsStats?.recentDonation.amount}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Recent Campaign</TableCell>
                  <TableCell>{purpose}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup}>Close</Button>
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
