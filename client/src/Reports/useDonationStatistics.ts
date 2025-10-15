/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import { useState, useEffect } from 'react';
import dayjs from 'dayjs'; // Import dayjs for date manipulation
import { useData, postData } from '../util/api';
import IDonation from '../util/types/donation';
import IDonor from '../util/types/donor';

const useDonationStatistics = () => {
  const [donationsData, setDonationsData] = useState<IDonation[]>([]);
  const [donorsData, setDonorsData] = useState<IDonor[]>([]);
  const donations = useData('donation/all');
  const donors = useData('donor/all');

  useEffect(() => {
    const data = donations?.data || [];
    setDonationsData(data);
  }, [donations]);

  useEffect(() => {
    const data = donors?.data || [];
    setDonorsData(data);
  }, [donors]);

  const filterDonationsByDateRange = (
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs,
  ) => {
    return donationsData.filter((donation) => {
      const donationDate = dayjs(donation.date);
      return donationDate.isAfter(startDate) && donationDate.isBefore(endDate);
    });
  };

  const getReportForDateRange = (filteredData: IDonation[]) => {
    if (filteredData.length > 0 && donorsData.length > 0) {
      // Use a more precise calculation for monetary values
      const total_donated = Number(
        filteredData
          .reduce((total, donation) => total + Number(donation.amount), 0)
          .toFixed(2),
      );

      const total_donations = filteredData.length;

      // Calculate averages with proper rounding
      const average_donations =
        total_donations === 0
          ? 0
          : Number(
              (
                Math.round((total_donated / total_donations) * 100) / 100
              ).toFixed(2),
            );

      const average_donations_per_person =
        donorsData.length === 0
          ? 0
          : Number(
              (
                Math.round((total_donated / donorsData.length) * 100) / 100
              ).toFixed(2),
            );

      // Calculate donor totals with proper precision
      const donorTotals = filteredData.reduce((acc, donation) => {
        acc[donation.donor_id] = Number(
          (
            Number(acc[donation.donor_id] || 0) + Number(donation.amount)
          ).toFixed(2),
        );
        return acc;
      }, {} as { [key: string]: number });

      const mostDonatedDonorId = Object.keys(donorTotals).reduce(
        (a, b) => (donorTotals[a] > donorTotals[b] ? a : b),
        '',
      );
      const mostDonatedDonorInfo = donorsData.find(
        (donor) => donor._id === mostDonatedDonorId,
      );
      const top_donator = {
        amount: donorTotals[mostDonatedDonorId],
        donor_name: mostDonatedDonorInfo?.contact_name,
        donor_id: mostDonatedDonorInfo?._id,
      };
      const largestDonation = filteredData.reduce(
        (max, donation) => (donation.amount > max.amount ? donation : max),
        filteredData[0],
      );
      const largestDonorInfo = donorsData.find(
        (donor) => donor._id === largestDonation.donor_id,
      );
      const largestDonationWithDonor = {
        amount: largestDonation.amount,
        donation_id: largestDonation._id,
        donor_name: largestDonorInfo?.contact_name,
        donor_id: largestDonorInfo?._id,
      };

      return {
        total_donated,
        total_donations,
        average_donations,
        average_donations_per_person,
        top_donator,
        largest_donation: largestDonationWithDonor,
      };
    }
    return null;
  };

  return {
    getReportForDateRange,
  };
};

export default useDonationStatistics;
