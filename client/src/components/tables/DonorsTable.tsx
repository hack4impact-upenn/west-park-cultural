/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import FilteringTable from './FilteringTable';
import { useData } from '../../util/api';

interface BasicTableProps {
  alignment: string;
}

function DonorsTable({ alignment }: BasicTableProps) {
  const donors = useData('donor/all');
  const donations = useData('donation/all');
  const [donorsData, setDonorsData] = useState<any>([]);
  useEffect(() => {
    const donorData = donors?.data || [];
    const donationData = donations?.data || [];
    setDonorsData(donorData);

    // Filter the data
    const filteredDonations = donationData.filter(
      (e: any) => e.type === alignment || alignment === 'all',
    );
    const uniquePeople = new Set(filteredDonations.map((e: any) => e.donor_id));
    const filteredDonors = donorData.filter((e: any) =>
      // eslint-disable-next-line dot-notation
      uniquePeople.has(e['_id']),
    );
    setDonorsData(filteredDonors);
  }, [donors?.data, alignment, donations?.data]);

  // Define the columns
  // <Name>, <Donor Group>, <Recent Donation>, <Last Communication>
  const columns = [
    { id: 'contact_name', label: 'Name' },
    { id: 'donor_group', label: 'Donor Group' },
    { id: 'last_donation_date', label: 'Recent Donation' },
    { id: 'last_communication_date', label: 'Last Communication' },
    // Add more columns as needed
  ];

  // Generate the rows
  const rows: any = [];
  donorsData.forEach((donor: any, index: number) => {
    const lastCom = donor.last_communication_date
      ? new Date(donor.last_communication_date).toISOString().split('T')[0]
      : 'N/A';
    rows.push({
      id: index + 1,
      contact_name: (
        <a
          href={`/donor-profile/${donor._id}`}
          style={{ textDecoration: 'none', color: '#0883ff' }}
        >
          {donor.contact_name}
        </a>
      ),
      donor_group: donor.donor_group,
      last_donation_date: new Date(donor.last_donation_date)
        .toISOString()
        .split('T')[0],
      last_communication_date: lastCom,
    });
  });

  return (
    <FilteringTable
      columns={columns}
      rows={rows}
      showAll={alignment === 'all'}
    />
  );
}

export default DonorsTable;
