import { useState, useEffect } from 'react';
import { useData, postData } from '../util/api';
import dayjs from 'dayjs'; // Import dayjs for date manipulation
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

  const filterDonationsByDateRange = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
    return donationsData.filter(donation => {
      const donationDate = dayjs(donation.date);
      return donationDate.isAfter(startDate) && donationDate.isBefore(endDate);
    });
  };

  const getReportForDateRange = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
    const filteredData = filterDonationsByDateRange(startDate, endDate);
    const total_donated = filteredData.reduce((total, donation) => total + donation.amount, 0);
    const total_donations = filteredData.length;
    const average_donations = total_donations === 0 ? 0 : parseFloat((total_donated / total_donations).toFixed(2));
    const average_donations_per_person = donorsData.length === 0 ? 0 : parseFloat((total_donated / donorsData.length).toFixed(2));
  
    const donorTotals = filteredData.reduce((acc, donation) => {
      acc[donation.donor_id] = (acc[donation.donor_id] || 0) + donation.amount;
      return acc;
    }, {} as { [key: string]: number });
  
    const mostDonatedDonorId = Object.keys(donorTotals).reduce((a, b) => (donorTotals[a] > donorTotals[b] ? a : b), '');
    const mostDonatedDonorInfo = donorsData.find(donor => donor._id === mostDonatedDonorId);
    const top_donator = { amount: donorTotals[mostDonatedDonorId], donor_name: mostDonatedDonorInfo?.contact_name, donor_id: mostDonatedDonorInfo?._id}
  
    const largestDonation = filteredData.reduce((max, donation) => donation.amount > max.amount ? donation : max, filteredData[0]);
    const largestDonorInfo = donorsData.find(donor => donor._id === largestDonation.donor_id);
    const largestDonationWithDonor = { amount: largestDonation.amount, donation_id: largestDonation._id, donor_name: largestDonorInfo?.contact_name, donor_id: largestDonorInfo?._id };

    return {
      total_donated,
      total_donations,
      average_donations,
      average_donations_per_person,
      top_donator,
      largest_donation: largestDonationWithDonor,
    };
  };
  
  return {
    getReportForDateRange,
  };
};

export default useDonationStatistics;
