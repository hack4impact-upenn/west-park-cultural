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
} from '@mui/material';
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

  const donorID = "65daa67d6c34e8adb9f2d2c4";
  const donations = useData(`donation/donor/${donorID}`);
  
  const [donationsData, setDonationsData] = useState<any>([]);
  const [donationsStats, setDonationsStats] = useState<DonationStats>();
  // const [purposeID, setPurposeID] = useState(""); 
  // const [purpose, setPurpose] = useState(""); 

  useEffect(() => {
    const data = donations?.data || [];
    setDonationsData(data);
  }, [donations?.data]);

  useEffect(() => {
    if (donationsData.length > 0) {
      calculateDonationStats(donationsData);
    }
  }, [donationsData]);

  // useEffect(() => {
  //   if (purposeID) {
  //     const purposeData = useData(`purpose/${purposeID}`);
  //     setPurpose(purposeData?.data[0].name);
  //     console.log(purposeData?.data[0].name);
  //   }
  // }, [purposeID]);

  const calculateDonationStats = (
    data: any
  ) => {

    if (data.length ) {
      // Calculate Total Donation Amount
      const totalDonationAmount = data.reduce(
        (total: number, donation: any) => total + donation.amount,
        0
      );

      // Calculate Average Donation (per Fiscal calendar date)
      const avDonationPerFiscal: BasicDonationStat = { amount: 0, count: 0 };

      // Calculate Average Donation (per Calendar date)
      const avDonationPerCalendar: BasicDonationStat = { amount: 0, count: 0 };

      // Calculate Donation (in past 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const donationsLast30Days = donationsData.filter(
        (donation: any) => new Date(donation.date) > thirtyDaysAgo
      );
      const donationsAmount30 = donationsLast30Days.reduce(
        (total: number, donation: any) => total + donation.amount,
        0
      );
      const donationCountLast30Days = donationsLast30Days.length;

      const donationThirtyDays: BasicDonationStat = {
        amount: donationsAmount30,
        count: donationCountLast30Days
      };

      // Find the most recent donation
      const mostRecentDonation = donationsData.reduce((mostRecent: any, donation: any) => {
        const donationDate = new Date(donation.date);
        if (!mostRecent || donationDate > new Date(mostRecent.date)) {
          return donation;
        }
        return mostRecent;
      }, null);

      // setPurposeID(mostRecentDonation.purpose_id);

      const stats: DonationStats = {
        totalDonationAmount: { amount: totalDonationAmount, count: donationsData.length },
        avDonationPerFiscal,
        avDonationPerCalendar,
        donationThirtyDays,
        recentDonation: { amount: mostRecentDonation.amount, date: mostRecentDonation.date }
      }
      setDonationsStats(stats);
    }
  }


  return (
    <div>
      <Button onClick={handleOpenPopup}>Popup 1</Button>

      {/* Popup */}
      <Dialog open={openPopup} onClose={handleClosePopup}>
        <DialogTitle>John Smith Summary</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Total Donation Amount</TableCell>
                  <TableCell>${donationsStats?.totalDonationAmount.amount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Average Donation (Fiscal)</TableCell>
                  <TableCell>${donationsStats?.avDonationPerFiscal.amount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Average Donation (Calendar)</TableCell>
                  <TableCell>${donationsStats?.avDonationPerCalendar.amount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Average Donation (Past 30 Days)</TableCell>
                  <TableCell>${donationsStats?.donationThirtyDays.amount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Recent Donation</TableCell>
                  <TableCell>${donationsStats?.recentDonation.amount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Recent Campaign</TableCell>
                  <TableCell>purpose</TableCell>
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

export default PopupPage;
